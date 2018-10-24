const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
      username        : String,
      reaction_id     : Number,
      message_id      : Number
});

module.exports = mongoose.model('Reaction', reactionSchema);
