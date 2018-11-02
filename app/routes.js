const Reaction = require('./models/reaction.js')

module.exports = function(app){
// welcome
app.get('/', (req, res) => {
    return res.status(200).send({
      message: 'Welcome to reaction service!'
    })
  })

// get reactions from single message
app.get('/messages/:id/reactions', (req, res) => {
    const id = parseInt(req.params.id, 10);
    return res.status(404).send({
      success: 'false',
      message: 'message does not exist',
    });
  });

//add reaction to message
app.post('/messages/:message_id/reactions', (req, res) => {
    const messageId = req.params.message_id
    const reactionId = req.query.reaction_id
    const username = req.get('Username')

    Reaction.findOne({'message_id': messageId, 'username': username}, (err, reaction) => {
      // new reaction
      if  (!reaction) {
        const newReaction = new Reaction({
          username: username,
          message_id: messageId,
          reaction_id: reactionId
        })
        newReaction.save().then(() => console.log('new reaction created'))
      }
      // update reaction
      else {
        reaction.reaction_id = reactionId
        reaction.save().then(() => console.log('reaction changed'))
      }
    })
    // response
    return res.status(201).send({
      success: true,
      message: 'reaction added successfully'
    })
    });

}
