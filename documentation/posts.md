  * [Get all Posts](#get-all-posts)
  * [Get search Posts](#get-search-posts)
  * [Get all the Posts of the user](#get-all-the-posts-of-the-user)
  * [Get a user Posts](#get-a-user-posts)
  * [Create Or Edit Posts](#create-or-edit-posts)
  * [Delete Posts](#delete-posts)
  * [Create RePosts](#create-reposts)
  * [Create Notification](#create-notification)
  * [Get User Notifications](#get-user-notifications)
  * [See Notification](#see_notification)
  
  
  
##  Get all Posts
  
  
```
   GET : /api/v1/posts (without token)
```
  
#### Success response example
  
```js
     {
       "data": [
         {
           "id": 29,
           "title": "title",
           "access": 1,
           "repost_access": 0,
           "description": "description",
           "expired_at": "5 day",
           "price": {
             "value": "2165.00",
             "currency": "AED"
           },
           "images": [
             {
               "url": "uploads/posts/images/197/sss.png",
               "width": 512,
               "height": 506
             },
             {
               "url": "uploads/posts/images/197/uuuuuuuu.png",
               "width": 512,
               "height": 506
             }
           ],
           "tags": [
             "tags"
           ],
           "created_at": "2016-07-12 13:19:57",
           "updated_at": "2016-07-12 13:19:57",
           "user": {
             "id": 2,
             "first_name": "test",
             "last_name": "test",
             "email": "test@test.te",
             "company_name": "test",
             "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
             "biography": "test",
             "url": "test",
             "telephone": "24356789",
             "address": "test@test.te",
             "active": 1,
             "code": "",
             "created_at": "2016-07-12 12:48:58",
             "updated_at": "2016-07-12 12:48:58",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "conversation": [
             {
               "sender": 218,
               "recipient": 346
             }
           ]
           "can_create_posts": 5
         },
         {
           "id": 28,
           "title": "title1",
           "access": 0,
           "description": "description2",
           "expired_at": "5 day",
           "price": {
             "value": "65.00",
             "currency": "AED"
           },
           "images": [
             {
               "url": "uploads/posts/images/197/sss.png",
               "width": 512,
               "height": 506
             },
             {
               "url": "uploads/posts/images/197/uuuuuuuu.png",
               "width": 512,
               "height": 506
             }
           ],
           "tags": [
             "fhfh"
           ],
           "created_at": "2016-07-12 13:19:31",
           "updated_at": "2016-07-12 13:19:31",
           "user": {
             "id": 3,
             "first_name": "test1",
             "last_name": "test1",
             "email": "test1@test.te",
             "company_name": "test",
             "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
             "biography": "test",
             "url": "test",
             "telephone": "24356789",
             "address": "test1@test.te",
             "active": 1,
             "code": "",
             "created_at": "2016-07-12 12:48:58",
             "updated_at": "2016-07-12 12:48:58",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "conversation": [
             {
               "sender": 218,
               "recipient": 346
             }
           ]
           "can_create_posts": 5
         }
       ]
     }
```
  
#### Failure response example
  
```js
      {
        "data": []
      }
```    

 
##  Get search Posts
  
  
```
   GET : /api/v1/search/posts (with token)
```  
  
  Name                     | Type           | Required
  -------------            | -------------  | -------------
  title                    | text           | false

#### Success response example
  
```js
     {
       "data": [
         {
           "id": 29,
           "title": "title",
           "access": 1,
           "description": "description",
           "expired_at": "5 day",
           "price": {
             "value": "2165.00",
             "currency": "AED"
           },
           "images": [
             {
               "url": "uploads/posts/images/197/sss.png",
               "width": 512,
               "height": 506
             },
             {
               "url": "uploads/posts/images/197/uuuuuuuu.png",
               "width": 512,
               "height": 506
             }
           ],
           "tags": [
             "tags"
           ],
           "created_at": "2016-07-12 13:19:57",
           "updated_at": "2016-07-12 13:19:57",
           "user": {
             "id": 2,
             "first_name": "test",
             "last_name": "test",
             "email": "test@test.te",
             "company_name": "test",
             "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
             "biography": "test",
             "url": "test",
             "telephone": "24356789",
             "address": "test@test.te",
             "active": 1,
             "code": "",
             "created_at": "2016-07-12 12:48:58",
             "updated_at": "2016-07-12 12:48:58",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "conversation": [
             {
               "sender": 218,
               "recipient": 346
             }
           ]
           "can_create_posts": 5
         },
         {
           "id": 28,
           "title": "title1",
           "access": 0,
           "description": "description2",
           "expired_at": "5 day",
           "price": {
             "value": "65.00",
             "currency": "AED"
           },
           "images": [
             {
               "url": "uploads/posts/images/197/sss.png",
               "width": 512,
               "height": 506
             },
             {
               "url": "uploads/posts/images/197/uuuuuuuu.png",
               "width": 512,
               "height": 506
             }
           ],
           "tags": [
             "fhfh"
           ],
           "created_at": "2016-07-12 13:19:31",
           "updated_at": "2016-07-12 13:19:31",
           "user": {
             "id": 3,
             "first_name": "test1",
             "last_name": "test1",
             "email": "test1@test.te",
             "company_name": "test",
             "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
             "biography": "test",
             "url": "test",
             "telephone": "24356789",
             "address": "test1@test.te",
             "active": 1,
             "code": "",
             "created_at": "2016-07-12 12:48:58",
             "updated_at": "2016-07-12 12:48:58",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "conversation": [
             {
               "sender": 218,
               "recipient": 346
             }
           ]
           "can_create_posts": 5
         }
       ]
     }
```
  
#### Failure response example
  
```js
      {
        "data": []
      }
```    


##  Get all the Posts of the user
  
  
```
   GET : /api/v1/posts/me (with token)
```
  
#### Success response example
  
```js
     {
       "data": [
         {
           "id": 32,
           "title": "title",
           "access": 1,
           "description": "description",
           "expired_at": "5 day",
           "price": {
             "value": "46554.00",
             "currency": "AUD"
           },
           "images": [],
           "tags": [],
           "created_at": "2016-07-19 06:05:24",
           "updated_at": "2016-07-19 06:05:24",
           "user": {
             "id": 3,
             "first_name": "first name",
             "last_name": "last name",
             "email": "test@test.tes",
             "company_name": "company name",
             "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
             "biography": "biography",
             "url": "url",
             "telephone": "1234567899",
             "address": "test@test.tes",
             "active": 1,
             "code": "",
             "created_at": "2016-07-13 08:36:37",
             "updated_at": "2016-07-13 08:36:37",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "can_create_posts": 4
         },
         {
           "id": 33,
           "title": "title",
           "access": 0,
           "description": "description",
           "expired_at": "5 day",
           "price": {
             "value": "46554.00",
             "currency": "AUD"
           },
             "images": [
               {
                 "url": "uploads/posts/images/197/sss.png",
                 "width": 512,
                 "height": 506
               },
               {
                 "url": "uploads/posts/images/197/uuuuuuuu.png",
                 "width": 512,
                 "height": 506
               }
             ],
           "tags": [],
           "created_at": "2016-07-19 06:49:22",
           "updated_at": "2016-07-19 06:49:22",
           "user": {
             "id": 3,
             "first_name": "first name",
             "last_name": "last name",
             "email": "test@test.tes",
             "company_name": "company name",
             "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
             "biography": "biography",
             "url": "url",
             "telephone": "1234567899",
             "address": "test@test.tes",
             "active": 1,
             "code": "",
             "created_at": "2016-07-13 08:36:37",
             "updated_at": "2016-07-13 08:36:37",
             "device_token": "",
             "country": "",
             "subscriptions": []
           },
           "can_create_posts": 4
         },
       ]
     }
```
  
#### Failure response example
  
```js
    {
        "data": []
    }
```    


##  Get a user Posts
  
  
```
   GET : /api/v1/posts/{postId} (with token)
```
  
#### Success response example
  
```js
    {
      "id": 35,
      "title": "title",
      "access": 1,
      "description": "description",
      "expired_at": "5 day",
      "price": {
        "value": "46554.00",
        "currency": "AUD"
      },
      "images": [
        {
          "url": "uploads/posts/images/197/sss.png",
          "width": 512,
          "height": 506
        },
        {
          "url": "uploads/posts/images/197/uuuuuuuu.png",
          "width": 512,
          "height": 506
        }
      ],
      "tags": [],
      "created_at": "2016-07-19 07:05:11",
      "updated_at": "2016-07-19 07:05:11",
      "user": {
        "id": 3,
        "first_name": "first name",
        "last_name": "last name",
        "email": "test@test.tes",
        "company_name": "sdfdf",
        "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
        "biography": "dgfrhg",
        "url": "dsgdg",
        "telephone": "sdg",
        "address": "test@test.tes",
        "active": 1,
        "code": "",
        "created_at": "2016-07-13 08:36:37",
        "updated_at": "2016-07-13 08:36:37",
        "device_token": "",
        "country": "",
        "subscriptions": []
      },
      "conversation": [
        {
          "sender": 218,
          "recipient": 346
        }
      ]
      "can_create_posts": 4,
      "code": 200
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid post id"
    }
```    

 
##  Create Or Edit Posts
  
    
```
   GET : /api/v1/search/posts (with token)
``` 
  
  Name                   | Type                                                                                     | Required
  -------------          | -------------                                                                            | -------------
  id                     | int(0 or user id for edit)	                                                            | true
  title                  | text                                                                                     | true
  access                 | text ( value 0 if posts private, value 1 if posts public )                               | true
  privacy[contact][0]    | text (integer contactId1 (if access value is 0 )                                         | false
  privacy[contact][1]    | text (integer contactId2 (if access value is 0 )                                         | false
  privacy[group][0]      | text (integer groupId1 (if access value is 0 )                                           | false
  privacy[group][1]      | text (integer groupId2 (if access value is 0 )                                           | false
  description            | text                                                                                     | true
  location               | text                                                                                     | true
  price                  | 	text (decimal, example 10.25)                                                           | true
  currency               | 	text (code ISO 4127 Standard, example "AUD")	                                        | true
  expired_at             | text(5 day)                                                                              | true
  image[ ]               | file(mimes:jpeg,jpg,png)                                                                 | true
  tags                   | text(separated by comma - i.e tag1,tag2,tag3 ....(if premium max available is 5 else 2)) | true
    
 ``` 
    for premium posts are without limit else 7 posts
```

#### Success response example
  
```js
    {
      "id": 37,
      "title": "title",
      "access": "0",
      "repost_access": 1,
      "description": "descriptionc",
      "expired_at": "5 day",
      "price": {
        "value": "465544",
        "currency": "AUD"
      },
      "images": [
        {
          "url": "uploads/posts/images/197/sss.png",
          "width": 512,
          "height": 506
        },
        {
          "url": "uploads/posts/images/197/uuuuuuuu.png",
          "width": 512,
          "height": 506
        }
      ],
      "tags": [],
      "created_at": "2016-07-19 08:30:37",
      "updated_at": "2016-07-19 08:30:37",
      "user": {
        "id": 3,
        "first_name": "first name",
        "last_name": "last name",
        "email": "test@test.tes",
        "company_name": "sdfdf",
        "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
        "biography": "biography",
        "url": "url",
        "telephone": "215454559",
        "address": "test@test.tes",
        "active": 1,
        "code": "",
        "created_at": "2016-07-13 08:36:37",
        "updated_at": "2016-07-13 08:36:37",
        "device_token": "",
        "country": "",
        "subscriptions": []
      },
      "conversation": [],
      "can_create_posts": 2,
      "code": 200
    }
```
  
#### Failure response example
  
```js
    {
      "success": false,
      "message": {
        "privacy.contact.0": [
          "The privacy.contact.0 must be a number."
        ],
        "privacy.group.0": [
          "The privacy.group.0 must be a number."
        ],
        "title": [
          "The title field is required."
        ],
        "access": [
          "The access field is required."
        ],
        "description": [
          "The description field is required."
        ],
        "location": [
          "The location field is required."
        ],
        "price": [
          "The price field is required."
        ],
        "currency": [
          "The currency field is required."
        ],
        "expired_at": [
          "The expired at field is required."
        ],
        "image": [
          "The image field is required."
        ]
      }
    }
```    

 
##  Delete Posts
  
   
```
    POST : /api/v1/posts/{postId} (with token)
```
  
  Name                   | Type                | Required
  -------------          | -------------       | -------------
  _method                | text (value DELETE) | true
  
#### Success response example
  
```js
    {
      "code": 200,
      "success": true,
      "message": "Your Posts have been successfully deleted"
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid post id"
    }
```    

 
##  Create RePosts
  
    
```
   POST : /api/v1/posts/reposts/{postId} (with token)
```
  
  Name                   | Type                                               | Required
  -------------          | -------------                                      | -------------
  title                  | text                                               | true
  description            | text                                               | true
  expired_at             | text(5 day)                                        | true
  image[ ]               | file(mimes:jpeg,jpg,png)                           | false
  tags                   | text(separated by comma - i.e tag1,tag2,tag3 ....) | false
  privacy[contact][0]    | text (integer contactId1 (if access value is 0 )   | false
  privacy[contact][1]    | text (integer contactId2 (if access value is 0 )   | false
  privacy[group][0]      | text (integer groupId1 (if access value is 0 )     | false
  privacy[group][1]      | text (integer groupId2 (if access value is 0 )     | false

#### Success response example
  
```js
    {
      "id": 57,
      "title": "title111",
      "access": 0,
      "repost_access": 1,
      "description": "descriptionc",
      "expired_at": "5 day",
      "price": {
        "value": "65.00",
        "currency": "AED"
      },
      "images": [
        {
          "url": "uploads/posts/images/197/sss.png",
          "width": 512,
          "height": 506
        },
        {
          "url": "uploads/posts/images/197/uuuuuuuu.png",
          "width": 512,
          "height": 506
        }
      ],
      "tags": [
        "sfsdffdhgfrh",
        "htgfhfgd",
        "f5b5fcb14"
      ],
      "created_at": "2016-07-21 08:37:55",
      "updated_at": "2016-07-21 08:37:55",
      "user": {
        "id": 3,
        "first_name": "first name",
        "last_name": "last name",
        "email": "test@test.tes",
        "company_name": "company name",
        "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
        "biography": "biography",
        "url": "url",
        "telephone": "1234567899",
        "address": "test@test.tes",
        "active": 1,
        "code": "",
        "created_at": "2016-07-13 08:36:37",
        "updated_at": "2016-07-13 08:36:37",
        "device_token": "",
        "country": "",
        "subscriptions": []
      },
      "conversation": []
      "can_create_posts": 3,
      "code": 200
    }
```
  
#### Failure response example
  
```js
    {
      "success": false,
      "message": {
        "privacy.contact.0": [
          "The privacy.contact.0 must be a number."
        ],
        "privacy.group.0": [
          "The privacy.group.0 must be a number."
        ],
        "title": [
          "The title field is required."
        ],
        "description": [
          "The description field is required."
        ]
      }
    }
    {
      "code": 400,
      "success": false,
      "message": " The limit of tags has been exceeded"
    }
    {
      "code": 400,
      "success": false,
      "message": "You are not a Premium User"
    }
```    

 
##  Create Notification
  
    
```
    POST : /api/v1/posts/notification (with token)
```
  
  Name                   | Type             | Required
  -------------          | -------------    | -------------
    post_id              | int( id )        | true
    user_id              | int( id )        | true

#### Success response example
  
```js
    {
      "id": 24,
      "user_id": 52,
      "post_id": 61,
      "is_see": false,
      "created_at": "2016-08-11 05:27:03",
      "updated_at": "2016-08-11 05:27:03",
      "code": 200
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid data"
    }
```    

 
##  Get User Notifications
  
    
```
GET : /api/v1/posts/notification/{userid} (with token)
```

#### Success response example
  
```js
    {
      "data": [
        {
          "id": 2,
          "user_id": 52,
          "post_id": 59,
          "is_see": 0,
          "created_at": "2016-08-10 08:03:48",
          "updated_at": "2016-08-10 08:07:50"
        },
        {
          "id": 4,
          "user_id": 52,
          "post_id": 60,
          "is_see": 0,
          "created_at": "2016-08-10 08:04:15",
          "updated_at": "2016-08-10 08:08:36"
        },
        {
          "id": 24,
          "user_id": 52,
          "post_id": 61,
          "is_see": 0,
          "created_at": "2016-08-11 05:27:03",
          "updated_at": "2016-08-11 05:27:03"
        }
      ]
    }
```
  
#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid user id"
    }
```    


##  See Notification


```
    POST : /api/v1/posts/notification (with token)
```
  
  Name                   | Type                      | Required
  -------------          | -------------             | -------------
  not_id                 | int( notification id )    | true

#### Success response example
  
```js
    {
      "id": 23,
      "user_id": 52,
      "post_id": 61,
      "is_see": true,
      "created_at": "2016-08-11 05:15:23",
      "updated_at": "2016-08-11 05:26:11",
      "code": 200
    }
```

#### Failure response example
  
```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid notification id"
    }
```    