const db = require('./db/db')
const bodyParser = require('body-parser')
const express = require('express')
// Set up the express app
const app = express();
// database
const mongoose = require('mongoose');
const configDB = require('./app/database_config.js')

// Parse incoming requests data
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// connect to database container
mongoose.connect(configDB.url, {});

// welcome
app.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Welcome to reaction service!'
  })
})

// get reactions from single message
app.get('/messages/:id/reactions', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((msg) => {
      if (msg.id === id) {
          if (msg.reactions.length > 0){
            return res.status(200).send({
                success: 'true',
                message: 'reactions were retrieved successfully',
                reactions: msg.reactions,
              });
          }

      }
    });
    return res.status(404).send({
      success: 'false',
      message: 'message does not exist',
    });
  });

//add reaction to message
app.put('/messages/:id/reactions', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let msgFound;
    let itemIndex;
    db.map((msg, index) => {
      if (msg.id === id) {
        msgFound = msg;
        itemIndex = index;
      }
    });

    if (!msgFound) {
      return res.status(404).send({
        success: 'false',
        message: 'msg not found',
      });
    }

    if (!req.body.reaction_id) {
      return res.status(400).send({
        success: 'false',
        message: 'reaction_id is required',
      });
    } else if (!req.body.message_id) {
      return res.status(400).send({
        success: 'false',
        message: 'message_id is required',
      });
    }

    const updatedMsg = {
      id: msgFound.id,
      reactions: msgFound.reactions.append(req.body.reaction_id || msgFound.reaction_id),
    };

    db.splice(itemIndex, 1, updatedMsg);

    return res.status(201).send({
      success: 'true',
      message: 'reaction added successfully',
      updatedMsg,
    });
  });

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
