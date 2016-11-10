  * [Get listings](#get-listings)
  
  
  
##  Get listings


```
    GET : api/v1/posts (with token)
```
  
  Name                   | Type                               | Required
  -------------          | -------------                      | -------------
  title                  | text (should be urldecoded)        | false
  tags                   | text (example tags=tag1,tag2,tag3) | false

#### Success response example
  
```js
    Request is - http://bizit.dev/api/v1/search/posts?title=Test%20title&tags=tag4,tag2
    
    
    Response is
    {
        "data": [
            {
              "id": 1,
              "title": "Test title",
              "description": "Some description",
              "location": "Yerevan",
              "expired_at": "8 day",
              "tags": [
                "tag4"
              ],
              "user": {
                "first_name": "Hrach",
                "last_name": "Tadevosyan",
                "email": "tadevosyanhrach@gmail.com",
                "company_name": "No company name provided",
                "biography": "No Biography provided",
                "url": "No url provided",
                "address": "No address provided",
                "telephone": "No telephone provided"
              }
            },
            {
              "id": 2,
              "title": "Test title",
              "description": "Some description",
              "location": "Yerevan",
              "expired_at": "5 day",
              "tags": {
                "1": "tag2"
              },
              "user": {
                "first_name": "Hrach",
                "last_name": "Tadevosyan",
                "email": "tadevosyanhrach1@gmail.com",
                "company_name": "No company name provided",
                "biography": "No Biography provided",
                "url": "No url provided",
                "address": "No address provided",
                "telephone": "No telephone provided"
              }
            },
            {
               "id": 3,
               "title": "Test title",
               "description": "Some description",
               "location": "Yerevan",
               "expired_at": "68 day",
               "tags": {
                 "1": "tag2"
               },
               "user": {
                 "first_name": "Hrach",
                 "last_name": "Tadevosyan",
                 "email": "tadevosyanhrac234h@gmail.com",
                 "company_name": "No company name provided",
                 "biography": "No Biography provided",
                 "url": "No url provided",
                 "address": "No address provided",
                 "telephone": "No telephone provided"
               }
            }
        ]
    }
```