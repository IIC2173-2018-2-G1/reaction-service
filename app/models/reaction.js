const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model("Reaction", reactionSchema);
