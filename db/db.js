const messages =  [
    {
      id: 1,
      channel_id: 1,
      response_to: 0,
      content: "This is a dummy message",
      reactions: [
            {
              reaction_id: 1,
              username: "caackermann"
            },
            {
                reaction_id: 2,
                username: "jiaranda"
            }
        ]
    },
    {
        id: 2,
        channel_id: 1,
        response_to: 0,
        content: "This is a dummy message with no reactions",
        reactions: []
      }
];

module.exports.messages = messages;
