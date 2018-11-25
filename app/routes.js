const Reaction = require("./models/reaction.js");
const mongoose = require("mongoose");
const { required_members, is_valid_id_for_collection } = require("./utils");
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
    const user_id = req.header("X-User-ID");
    
    const { message_id } = req.params;
    const message = await is_valid_id_for_collection(
      message_id,
      "messages",
      {
        success: "false",
        message: "invalid message_id"
      },
      res
    );
    if (!message) return;

    if (!required_members(req.body, ["reaction_id"], res)) return;
    const { reaction_id } = req.body;

    const reaction = await is_valid_id_for_collection(
      reaction_id,
      "reactions",
      {
        success: "false",
        message: "invalid reaction_id"
      },
      res
    );
    if (!reaction) return;

    const _id = new ObjectId(message_id);

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
