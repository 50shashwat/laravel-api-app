  * [Send message](#send-message)
  * [Conversations](#conversations)
  * [Open User Conversation](#open-user-conversation)
  * [Close User Conversation](#close-user-conversation)
  * [Send reply](#send-reply)
  
  
  
##  Send message


```
    POST : api/v1/posts/{postId}/message/send (with token)
```
  
  Name                   | Type             | Required
  -------------          | -------------    | -------------
  text                   | text             | true

#### Success response example
  
```js
    {
      "sender": {
        "id": 2,
        "first_name": "Hrach",
        "last_name": "Tadevosyan",
        "email": "name@example.com",
        "is_active": true
      },
      "receiver": {
        "id": 1,
        "first_name": "Receiver",
        "last_name": "Receiver last_name",
        "email": "another@exampl.com",
        "is_active": true
      },
      "post": {
        "id": 1,
        "title": "Test title",
        "description": "Some description",
        "location": "Yerevan",
        "expired_at": "10 day"
      },
      "message": "Some text message test 2 ",
      "code": 200
    }
```
  
  
##  Conversations


```
    GET : /api/v1/users/conversations (with token)
```
  
#### Success response example
  
```js
    {
      "data": [
        {
          "user_1": {
            "id": 218,
            "email": "email@email.email"
          },
          "user_2": {
            "id": 34,
            "email": "test@test.te12"
          },
          "post": {
            "id": 444,
            "user_id": 34,
            "title": "title",
            "access": 1,
            "price": "10.25",
            "currency": "AUD",
            "description": "description",
            "location": "location",
            "expired_at": "2016-10-28 16:28:28",
            "created_at": "06:45, 12 October 2016",
            "updated_at": "06:45, 12 October 2016",
            "deleted_at": null,
            "active": 1
          },
          "started": "09:28, 25 October 2016",
          "finished": "09:48, 25 October 2016"
        },
        {
          "user_1": {
            "id": 218,
            "email": "email@email.email"
          },
          "user_2": {
            "id": 34,
            "email": "test@test.te12"
          },
          "post": {
            "id": 441,
            "user_id": 35,
            "title": "title",
            "access": 1,
            "price": "10.25",
            "currency": "AUD",
            "description": "description",
            "location": "location",
            "expired_at": "2016-11-24 16:28:47",
            "created_at": "06:45, 12 October 2016",
            "updated_at": "06:45, 12 October 2016",
            "deleted_at": null,
            "active": 1
          },
          "started": "10:06, 25 October 2016",
          "finished": "11:15, 26 October 2016"
        }
      ]
    }
```
  
   
##  Open User Conversation


```
    GET : /api/v1/users/conversationsOpen/{userId}/{postId} (with token)
```

#### Success response example
  
```js
    {
      "code": 200,
      "success": true,
      "message": "You have successfully started the conversation. "
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter valid data"
    }
    
    {
      "code": 400,
      "success": false,
      "message": "Conversation is already open"
    }
```    


##  Close User Conversation


```
    GET : /api/v1/users/conversationsClose/{userId}/{postId} (with token)
```
  
#### Success response example
  
```js
    {
      "code": 200,
      "success": true,
      "message": "You have successfully finished the conversation."
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "No conversation"
    }
```    


##  Send reply


```
    POST : /api/v1/posts/notification (with token)
```
  
  Name                   | Type            | Required
  -------------          | -------------   | -------------
  message                | text            | true

#### Success response example
  
```js
    {
      "sender": {
        "id": 2,
        "first_name": "Hrach",
        "last_name": "Tadevosyan",
        "email": "name@example.com",
        "is_active": true
      },
      "receiver": {
        "id": 1,
        "first_name": "Receiver",
        "last_name": "Receiver last_name",
        "email": "another@exampl.com",
        "is_active": true
      },
      "post": {
        "id": 1,
        "title": "Test title",
        "description": "Some description",
        "location": "Yerevan",
        "price": {
          "value": "10.25",
          "currency": "AUD"
        },
        "expired_at": "10 day"
      },
      "message": "Some text message test 2 ",
      "code": 200
    }
```