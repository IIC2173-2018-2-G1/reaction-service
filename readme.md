# Reaction Service
This is the reaction microservice. It will be in charge of creating and deleting new reactions, and informing the creation of new reactions to the notification service

# This service should allow inbound HTTP requests on port 8081

## Admitted Requests

- New Reaction:
> POST /messages/{message_id}/reactions
```javascript
{
    message_id: integer
    reaction_id: integer
}
```

> Response:
```javascript
{
    reaction: 
    Error: string (default: "")
}
```

- Delete Reaction:
> DELETE /messages/{message_id}/reactions
```javascript
{
    "reaction_id": integer
}
```

> Response:
```javascript
{
    Error: string (default: "")
}
```

- GET message reactions (validate):
> GET /messages/{message_id}/reactions
```javascript
{
  message_id: integer
}
```

> Response:
```javascript
{
    reactions: [
        {
            reaction_id: integer,
            username: string
        }
    ]
    Error: string (default: "")
}

# Things to note:
- Given that OneSignal can make notification based on the tags the user makes, this could be a way of working with notifications. Just tag on which channels the user has subscribed.
- But on every new subcription, there will have to be a way of associating OneSignal's device_id to the user. This must be handled in this microservice.