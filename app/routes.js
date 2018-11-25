const Reaction = require("./models/reaction.js");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
  // welcome
  app.get("/reactions", (req, res) => {
    Reaction.find()
      .sort({ name: 1 })
      .select(["id", "name"])
      .exec()
      .then(reactions => res.json(reactions))
      .catch(error => res.status(500).json({ error }));
  });

  //add reaction to message
  app.put("/messages/:message_id/reactions", async (req, res) => {
    const { message_id } = req.params;
    const { reaction_id } = req.body;
    const user_id = req.header("X-User-ID");

    if (typeof reaction_id === "undefined") {
      return res.status(400).json({
        success: "false",
        message: "reaction_id is required"
      });
    }

    const reaction = await Reaction.findById(reaction_id).exec();
    if (!reaction) {
      return res.status(400).json({
        success: "false",
        message: "invalid reaction_id"
      });
    }

    const _id = new ObjectId(message_id);

    const message = await mongoose.connection.db
      .collection("messages")
      .findOne({ _id });

    if (!message) {
      return res.status(400).json({
        success: "false",
        message: "invalid message_id"
      });
    }

    const same_reaction = await mongoose.connection.db
      .collection("messages")
      .findOne({
        _id,
        reactions: { $elemMatch: { reaction_id, users: user_id } }
      });

    // remove any possible reaction from this user on message
    await mongoose.connection.db
      .collection("messages")
      .find({ _id, "reactions.reaction_id": { $exists: true } })
      .forEach(async item => {
        item.reactions.forEach(reaction => {
          reaction.users = reaction.users.filter(usr => usr != user_id);
        });
        await mongoose.connection.db.collection("messages").save(item);
      });

    if (same_reaction === null) {
      // add the new reaction
      await mongoose.connection.db.collection("messages").updateOne(
        { _id, "reactions.reaction_id": { $ne: reaction_id } },
        {
          $push: {
            reactions: {
              reaction_id,
              users: []
            }
          }
        }
      );
      await mongoose.connection.db.collection("messages").updateOne(
        { _id, "reactions.reaction_id": reaction_id },
        {
          $push: {
            "reactions.$.users": user_id
          }
        }
      );
    }

    res.status(200).send("");
  });
};
