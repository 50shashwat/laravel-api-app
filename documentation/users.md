


  * [Create User](#create-user)
  * [User's Login](#login-user)
  * [User's Update](#update-user)
  * [User's listings](#User-listings)
  * [Get user's contacts](#get-user-contacts)
  * [Get user's contact](#get-user-contact)
  * [Add to user's contacts](#add-user-contacts)
  * [Accept user's contacts](#accept-user-contacts)
  * [Delete from user's contacts](#delete-from-user-contacts)
  * [Invitation list](#invitation-list)
  * [Get user's groups](#get-user-groups)
  * [Get user's group](#get-user-group)
  * [Create user's group](#create-user-group)
  * [Edit user's group](#edit-user-group)
  * [Delete user's group](#delete-user-group)
  * [Get group user's](#get-group-user)
  * [Add users to a group](#add-users-to-a-group)
  * [Delete users from a group](#delete-users-from-a-group)
  * [Search User by email,first name and last name](#search-user-by-email-first-name-and-last-name)
  * [Change User Avatar](#change-user-avatar)
  * [Get users bay phone number and email](#get-users-bay-phone-number-and-email)
  * [Check user email exist](#check-user-email-exist)
  * [Check Post Limit](#check-post-limit)
  * [User Meta](#user-meta)
  * [User Info](#user-info)
  * [Get User By Quickblox Ids](#get-user-by-quickblox-ids)
  
  
  
## Create User


```
  POST : /api/v1/register (without token)
```

Name                     | Type                     | Required
-------------            | -------------            | -------------
email                    | email                    | true
password                 | password                 | true
avatar                   | image (mimes:jpeg,png)   | true
type                     | int (0,1)                | true
transaction_id           | text                     | false(if type == 1 (true))
purchase_date            | text                     | false(if type == 1 (true))
product_id               | text                     | false(if type == 1 (true))
expired_at               | text                     | false(if type == 1 (true))
company_name             | text                     | false
biography                | text                     | false
url                      | text                     | false
telephone                | text                     | false
address                  | text                     | false
device_token             | text                     | false

#### Success response example

```json
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL
        2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjY
        ThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "",
        "type": 0,
        "product_id": "",
        "purchase_date": "",
        "transaction_id": "",
        "code": 200
    }
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2F
        waVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmO
        TcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "2016-09-28 12:00:19 Etc/GMT",
        "type": 1,
        "product_id": "com.gss.monthly",
        "purchase_date": "2016-09-28 12:00:19 Etc/GMT",
        "transaction_id": "1000000241330879",
        "code": 200
    }
```

#### Failure response example

```js
    {
        "success": false,
        "message": {
        "email": [
              "The email field is required."
            ]
        }
    }
    
    {
      "error": "invalid_credentials"
    }
```    


## Login User


```
  POST : /api/v1/login (without token)
```

Name                     | Type                     | Required
-------------            | -------------            | -------------
email                    | email                    | true
password                 | password                 | true
device_token             | text                     | false

#### Success response example

```js
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "",
        "type": 0,
        "product_id": "",
        "purchase_date": "",
        "transaction_id": "",
        "code": 200
    }
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "2016-09-28 12:00:19 Etc/GMT",
        "type": 1,
        "product_id": "com.gss.monthly",
        "purchase_date": "2016-09-28 12:00:19 Etc/GMT",
        "transaction_id": "1000000241330879",
        "code": 200
    }
```


#### Failure response example


```js
    {
        "success": false,
        "message": {
        "email": [
              "The email field is required."
            ]
        }
    }
    
    {
      "error": "invalid_credentials"
    }
```


## Update User


```
  POST : /api/v1/user (with token)
```

Name                     | Type                     | Required
-------------            | -------------            | -------------
_method                  | PUT                      | true
password                 | password                 | true
old password             | password                 | true
avatar                   | 	image (mimes:jpeg,png)  | true
company_name             | text                     | false
biography                | text                     | false

#### Success response example

```js
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "",
        "type": 0,
        "product_id": "",
        "purchase_date": "",
        "transaction_id": "",
        "code": 200
    }
    {
        "id": 172,
        "email": "mac@gmail.com",
        "country": "United States",
        "avatar": "",
        "company": "Mac OS",
        "biography": "No Biography provided",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
        "expire_date": "2016-09-28 12:00:19 Etc/GMT",
        "type": 1,
        "product_id": "com.gss.monthly",
        "purchase_date": "2016-09-28 12:00:19 Etc/GMT",
        "transaction_id": "1000000241330879",
        "code": 200
    }
```

#### Failure response example

```js
    {
        "success": false,
        "message": {
            "password": [
              "The password field is required."
            ],
            "password_confirmation": [
              "The password confirmation field is required."
            ]
        }
    }
```    


##  User Listings


```
  GET : /api/v1/users/posts?type=(0 or 1) (with token)
```

#### Success response example

```js
    {
      "data": [
        {
          "id": 2,
          "title": "Test title",
          "description": "Some description",
          "expired_at": "5 day",
          "images": [
            {
              "url": "uploads/posts/images/180/uuuuuuuu.png",
              "width": 512,
              "height": 506
            }
          "tags": [],
          "created_at": "2016-05-13 15:20:27",
          "updated_at": "2016-05-28 00:13:16",
          "user": {
            "id": 1,
            "first_name": "Hrach",
            "last_name": "Tadevosyan",
            "email": "tadevosyanhrach@gmail.com",
            "company_name": "No company name provided",
            "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
            "biography": "No Biography provided",
            "url": "No url provided",
            "telephone": "No telephone provided",
            "address": "No address provided",
            "active": 0,
            "code": "Tokqul8ronVg0SwZPEpx9ZZ6ZNn1WmgTP3OUjiJfhT0woDpdB61EYkLgyqvz",
            "created_at": "2016-05-13 15:18:14",
            "updated_at": "2016-06-01 17:41:41",
            "device_token": "some_device_token",
            "country": "",
            "subscriptions": []
          },
          "can_create_posts": 4
        },
        {
          "id": 3,
          "title": "Test title",
          "description": "Some description",
          "expired_at": "5 day",
          "images": [
            "uploads/posts/images/3/default.jpg",
            "uploads/posts/images/3/images.jpg",
            "uploads/posts/images/3/test.jpg"
          ],
          "tags": [],
          "created_at": "2016-05-13 15:21:07",
          "updated_at": "2016-05-27 23:46:32",
          "user": {
            "id": 1,
            "first_name": "Hrach",
            "last_name": "Tadevosyan",
            "email": "tadevosyanhrach@gmail.com",
            "company_name": "No company name provided",
            "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
            "biography": "No Biography provided",
            "url": "No url provided",
            "telephone": "No telephone provided",
            "address": "No address provided",
            "active": 0,
            "code": "Tokqul8ronVg0SwZPEpx9ZZ6ZNn1WmgTP3OUjiJfhT0woDpdB61EYkLgyqvz",
            "created_at": "2016-05-13 15:18:14",
            "updated_at": "2016-06-01 17:41:41",
            "device_token": "some_device_token",
            "country": "",
            "subscriptions": []
          },
          "can_create_posts": 4
        },
        {
          "id": 15,
          "title": "Test title",
          "description": "Some description",
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "asdfafd",
            "1",
            "qwer"
          ],
          "created_at": "2016-05-15 14:23:54",
          "updated_at": "2016-05-28 00:13:19",
          "user": {
            "id": 1,
            "first_name": "Hrach",
            "last_name": "Tadevosyan",
            "email": "tadevosyanhrach@gmail.com",
            "company_name": "No company name provided",
            "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
            "biography": "No Biography provided",
            "url": "No url provided",
            "telephone": "No telephone provided",
            "address": "No address provided",
            "active": 0,
            "code": "Tokqul8ronVg0SwZPEpx9ZZ6ZNn1WmgTP3OUjiJfhT0woDpdB61EYkLgyqvz",
            "created_at": "2016-05-13 15:18:14",
            "updated_at": "2016-06-01 17:41:41",
            "device_token": "some_device_token",
            "country": "",
            "subscriptions": []
          },
          "can_create_posts": 4
        },
        {
          "id": 16,
          "title": "Test title",
          "description": "Some description",
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "adf",
            "adsf",
            "test"
          ],
          "created_at": "2016-05-15 14:24:59",
          "updated_at": "2016-05-27 23:46:33",
          "user": {
            "id": 1,
            "first_name": "Hrach",
            "last_name": "Tadevosyan",
            "email": "tadevosyanhrach@gmail.com",
            "company_name": "No company name provided",
            "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
            "biography": "No Biography provided",
            "url": "No url provided",
            "telephone": "No telephone provided",
            "address": "No address provided",
            "active": 0,
            "code": "Tokqul8ronVg0SwZPEpx9ZZ6ZNn1WmgTP3OUjiJfhT0woDpdB61EYkLgyqvz",
            "created_at": "2016-05-13 15:18:14",
            "updated_at": "2016-06-01 17:41:41",
            "device_token": "some_device_token",
            "country": "",
            "subscriptions": []
          },
          "can_create_posts": 4
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


##  Get User Contacts


```
 GET : /api/v1/users/contacts (with token)
```

#### Success response example

```js
    {
      "data": [
        {
          "id": 22,
          "status": "pending",
          "contact": {
            "id": 1,
            "first_name": "first name",
            "last_name": "last name",
            "email": "test.test@gmail.com",
            "company_name": "test",
            "biography": "testing",
            "url": "test.test@gmail.com@gmail.com",
            "address": "api@pallitapp.com",
            "telephone": "12132155",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": "",
            "expired_at": "2016-09-28 12:00:19 Etc/GMT",
          },
          "created_at": "2016-07-11 08:12:49",
          "updated_at": "2016-07-11 08:12:49"
        },
        {
          "id": 23,
          "status": "accepted",
          "contact": {
            "id": 2,
            "first_name": "first_name test",
            "last_name": "last_name test",
            "email": "test1@test.te",
            "company_name": "test",
            "biography": "test",
            "url": "test",
            "address": "test@test.te",
            "telephone": "24356789",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": "",
            "expired_at": "2016-09-28 12:00:19 Etc/GMT",
          },
          "created_at": "2016-07-12 12:48:58",
          "updated_at": "2016-07-12 12:48:58"
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


##  Get User Contact


```
 GET : /api/v1/users/contacts/{contactId} (with token)
```

#### Success response example

```js
    {
      "data": [
        {
          "status": "pending",
          "contact": {
            "id": 268,
            "first_name": "Jon",
            "last_name": "Green",
            "email": "test_email@email.email",
            "company_name": "apple",
            "biography": "biography",
            "url": "No url provided",
            "address": "No address provided",
            "telephone": "No telephone provided",
            "avatar": "uploads/avatars/users/268/first_name-avatar-57fcd5e40f25b.jpg",
            "device_token": "",
            "expired_at": "2016-09-28 12:15:19 Etc/GMT"
          },
          "created_at": "12:35, 11 October 2016",
          "updated_at": "12:35, 11 October 2016"
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

 
## Add to user contacts


```
 POST : /api/v1/users/contacts (with token)
```

Name                     | Type                                       | Required
-------------            | -------------                              | -------------
contacts[0]              | text (numeric {userId1} OR text {Email})   | true
contacts[1]              | text (numeric {userId2} OR text {Email})   | true
contacts[...]            | text (numeric {userId...} OR text {Email}) | true

#### Success response example

```js
    {
      "data": [
        {
          "status": "pending",
          "contact": {
            "id": 268,
            "first_name": "Jon",
            "last_name": "Green",
            "email": "test_email@email.email",
            "company_name": "Apple",
            "biography": "biography",
            "url": "No url provided",
            "address": "No address provided",
            "telephone": "No telephone provided",
            "avatar": "uploads/avatars/users/268/first_name-avatar-57fcd5e40f25b.jpg",
            "device_token": "",
            "expired_at": "2016-09-28 12:15:19 Etc/GMT"
          },
          "created_at": "12:35, 11 October 2016",
          "updated_at": "12:35, 11 October 2016"
        },
        {
          "status": "pending"
          "contact": {
            "id": 200,
            "first_name": "Jon",
            "last_name": "Green",
            "email": "test_email@email.email",
            "company_name": "Apple",
            "biography": "biography",
            "url": "No url provided",
            "address": "No address provided",
            "telephone": "No telephone provided",
            "avatar": "uploads/avatars/users/268/first_name-avatar-57fcd5e40f25b.jpg",
            "device_token": "",
            "expired_at": "2016-09-28 12:15:19 Etc/GMT"
          },
          "created_at": "12:35, 11 October 2016",
          "updated_at": "12:35, 11 October 2016"
        }
      ]
    }
```


#### Failure response example

#####If contacts value isn't filled in

```js
    {
      "success": false,
      "message": {
            "contacts.1": [
                 "The contacts.1 field is required."
            ]
      }
    }  
```    

#####If contacts value isn't a number

```js
    {
      "success": false,
      "message": {
            "contacts.0": [
                 "The contacts.1 must be a number."
            ]
      }
    } 
```    


##  Accept user contacts


```
 GET : /api/v1/users/contacts/accept/{contactId} (with token)
```

#### Success response example

```js
    {
      "code": 200,
      "success": true,
      "message": "You accepted contact"
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


##  Delete From User Contacts


```
 POST : /api/v1/users/contacts (with token)
```

Name                     | Type                         | Required
-------------            | -------------                | -------------
_method                  | text (value DELETE)          | true
contacts[0]              | text (numeric {contactId1})  | true
contacts[1]              | text (numeric {contactId2})  | true
contacts[...]            | text (numeric {contactId...})| true

#### Success response example

```js
    {
      "code": 200,
      "success": true,
      "message": "Your contact have been successfully deleted"
    }
```


#### Failure response example


```js
    {
        "success": false,
        "message": {
            "contacts.1": [
                "The contacts.1 field is required."
            ]
        }
    }
    {
        "success": false,
        "message": {
            "contacts.0": [
                "The contacts.1 must be a number."
            ]
        }
    }
    {
        "code": 400,
        "success": false,
        "message": "Please enter a valid contact id"
    }
```    


## Invitation List


```
 GET : /api/v1/users/invite (with token)
```

#### Success response example

```js
    {
      "data": [
        {
          "status": "pending",
          "contact": {
            "id": 1,
            "first_name": "testing",
            "last_name": "testing",
            "email": "testing.testing@gmail.com",
            "company_name": "test",
            "biography": "testing",
            "url": "testing.testing@gmail.com",
            "address": "api@pallitapp.com",
            "telephone": "test.dev",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": ""
          },
          "created_at": "2016-07-21 10:07:33",
          "updated_at": "2016-07-21 11:49:00"
        },
        {
          "status": "pending",
          "contact": {
            "id": 2,
            "first_name": "test",
            "last_name": "test",
            "email": "test@test.te",
            "company_name": "test",
            "biography": "test",
            "url": "test",
            "address": "test@test.te",
            "telephone": "24356789",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": ""
          },
          "created_at": "2016-07-21 10:07:53",
          "updated_at": "2016-07-21 10:07:53"
        }
      ]
    }
```

#### Failure response example

```js
    {
      "data": [ ]
    }
```


## Get User Groups


```
 GET : /api/v1/users/groups (with token)
```

#### Success response example

```js
      {
        "data": [
          {
            "id": 23,
            "user_id": 3,
            "name": "group1",
            "created_at": "2016-07-18 11:53:33",
            "updated_at": "2016-07-18 11:53:42"
          },
          {
            "id": 24,
            "user_id": 3,
            "name": "group2",
            "created_at": "2016-07-18 11:53:52",
            "updated_at": "2016-07-18 11:53:56"
          }
        ]
      }
    
```

#### Failure response example

```js
    {
      "data": [ ]
    }
```


## Get User Group


```
 GET : /api/v1/users/groups/{groupId} (with token)
```

#### Success response example

```js
    {
    "data": [
      {
        "id": 23,
        "user_id": 3,
        "name": "group1",
        "created_at": "2016-07-18 11:53:33",
        "updated_at": "2016-07-18 11:53:42"
      }
    ]
    }
```

#### Failure response example

```js
    {
      "data": [ ]
    }
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid group id"
    }
```


## Create User Group


```
 POST : /api/v1/users/groups/ (with token)
```

Name                     | Type           | Required
-------------            | -------------            | -------------
name                     | text                     | true

#### Success response example

```js
    {
      "id": 25,
      "user_id": 3,
      "name": "group3",
      "created_at": "2016-07-18 08:15:59",
      "updated_at": "2016-07-18 08:15:59",
      "code": 200
    }
```


#### Failure response example


```js
    {
      "success": false,
      "message": {
        "name": [
          "The name field is required."
        ]
      }
    }
    {
      "code": 400,
      "success": false,
      "message": "Sorry you have exceeded the limit of groups"
    }
```


## Edit User Group


```
 POST : /api/v1/users/groups/ (with token)
```

Name                     | Type                     | Required
-------------            | -------------            | -------------
name                     | text                     | true
_method                  | text (value PUT)         | true

#### Success response example

```js
    {
      "id": 25,
      "user_id": 3,
      "name": "group3",
      "created_at": "2016-07-18 08:15:59",
      "updated_at": "2016-07-18 08:15:59",
      "code": 200
    }
```

#### Failure response example

```js
    {
      "success": false,
      "message": {
        "name": [
          "The name field is required."
        ]
      }
    }
```


##  Delete User Group


```
 POST : /api/v1/users/groups (with token)
```

Name                     | Type                         | Required
-------------            | -------------                | -------------
_method                  | text (value DELETE)          | true
groups[0]                | text (numeric {groupId1})    | true
groups[1]                | text (numeric {groupId2})    | true
groups[...]              | text (numeric {groupId...})  | true

#### Success response example

```js
    {
      "code": 200,
      "success": true,
      "message": "Your groups have been successfully deleted"
    }
```

#### Failure response example

```js
    {
      "success": false,
      "message": {
            "groups.0": [
                 "The groups.0 field is required."
            ]
      }
    }
    {
      "success": false,
      "message": {
            "groups.1": [
                 "The groups.1 must be a number."
            ]
      }
    } 
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid groups id"
    }
```    


## Get Group User


```
 GET : /api/v1/users/groupusers/{groupId} (with token)
```

#### Success response example

```js
    {
      "data": [
        {
          "userinfo": {
            "id": 2,
            "first_name": "test",
            "last_name": "test",
            "email": "test@test.te",
            "company_name": "test",
            "biography": "test",
            "url": "test",
            "address": "test@test.te",
            "telephone": "24356789",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": "",
            "expired_at": "2016-09-28 12:15:19 Etc/GMT"
          },
          "created_at": "2016-07-18 11:59:28",
          "updated_at": "2016-07-18 11:59:28"
        },
        {
          "userinfo": {
            "id": 1,
            "first_name": "testing",
            "last_name": "testing",
            "email": "testing@gmail.com",
            "company_name": "test",
            "biography": "testing",
            "url": "testing@gmail.com",
            "address": "api@pallitapp.com",
            "telephone": "test.dev",
            "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
            "device_token": ""
            "expired_at": "2016-09-28 12:15:19 Etc/GMT"
          },
          "created_at": "2016-07-18 12:03:47",
          "updated_at": "2016-07-18 12:03:47",
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


##  Add Users To A Group


```
 POST : /api/v1/users/groupusers/{groupId} (with token)
```

Name                     | Type                         | Required
-------------            | -------------                | -------------
userIds[0]               | text (numeric {userId1})     | true
userIds[1]               | text (numeric {userId2})     | true
userIds[...]             | text (numeric {userId...})   | true

#### Success response example

```js
    {
      "data": [
        {
          "userinfo": {
            "id": 2,
            "first_name": "test",
            "last_name": "test",
            "email": "test@test.te",
            "company_name": "test",
            "biography": "test",
            "url": "test",
            "address": "test@test.te",
            "telephone": "24356789",
            "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
            "device_token": ""
          },
          "created_at": "2016-07-18 11:59:28",
          "updated_at": "2016-07-18 11:59:28"
        },
        {
          "userinfo": {
            "id": 1,
            "first_name": "testing",
            "last_name": "testing",
            "email": "testing@gmail.com",
            "company_name": "test",
            "biography": "testing",
            "url": "testing@gmail.com",
            "address": "api@pallitapp.com",
            "telephone": "test.dev",
            "avatar": "uploads/avatars/users/1/testing-avatar-57835501650c7.png",
            "device_token": ""
          },
          "created_at": "2016-07-18 12:03:47",
          "updated_at": "2016-07-18 12:03:47"
        }
      ]
    }
```

#### Failure response example

```js
   {
      "success": false,
      "message": {
            "groups.0": [
                 "The groups.0 field is required."
            ]
      }
   }
   {
      "success": false,
      "message": {
            "groups.1": [
                 "The groups.1 must be a number."
            ]
      }
  }
```    


##  Delete Users From A Group


```
 POST : /api/v1/users/groupusers/{groupId} (with token)
```

Name                     | Type                         | Required
-------------            | -------------                | -------------
_method                  | text (value DELETE)          | true
userIds[0]               | text (numeric {userId1})     | true
userIds[1]               | text (numeric {userId2})     | true
userIds[...]             | text (numeric {userId...})   | true

#### Success response example

```js
    {
      "code": 200,
      "success": true,
      "message": "Your selected users have been successfully deleted"
    }
```

#### Failure response example

```js
    {
      "success": false,
      "message": {
            "groups.0": [
                 "The groups.0 field is required."
            ]
      }
    }
    {
      "success": false,
      "message": {
            "groups.1": [
                 "The groups.1 must be a number."
            ]
      }
    }
    {
        "code": 400,
        "success": false,
        "message": "Please enter a valid user id"
    }
```    


##  Search User By Email First Name And last Name


```
 GET : /api/v1/users/search (with token)
```

Name               | Type                                    | Required
-------------      | -------------                           | -------------
q                  | text(First Name ,Last Name Or Email)    | true

#### Success response example

```js
    {
      "data": [
        {
          "id": 52,
          "first_name": "test",
          "last_name": "test",
          "email": "test@email.com",
          "country": "",
          "avatar": "",
          "company_name": "Google",
          "biography": "No Biography provided",
          "url": "No url provided",
          "telephone": "No telephone provided",
          "address": "No address provided",
          "is_active": true,
          "posts": [
            {
              "id": 68,
              "title": "test",
              "description": "eaWEFAWE",
              "access": 0,
              "price": {
                "value": "465.00",
                "currency": "AED"
              },
              "expired_at": "5 day",
              "images": [],
              "tags": [
                "ssd",
                "sdds",
                "sdds"
              ],
              "created_at": "2016-08-08 07:05:09",
              "updated_at": "2016-08-08 07:05:09"
            },
            {
              "id": 69,
              "title": "test",
              "description": "eaWEFAWE",
              "access": 0,
              "price": {
                "value": "465.00",
                "currency": "AED"
              },
              "expired_at": "5 day",
              "images": [],
              "tags": [
                "ssd",
                "sdds",
                "sdds"
              ],
              "created_at": "2016-08-08 07:08:46",
              "updated_at": "2016-08-08 07:08:46"
            },
            {
              "id": 70,
              "title": "test",
              "description": "eaWEFAWE",
              "access": 0,
              "price": {
                "value": "465.00",
                "currency": "AED"
              },
              "expired_at": "5 day",
              "images": [],
              "tags": [
                "ssd",
                "sdds",
                "sdds"
              ],
              "created_at": "2016-08-08 07:14:18",
              "updated_at": "2016-08-08 07:14:18"
            },
            {
              "id": 71,
              "title": "test",
              "description": "yjtyjftyj",
              "access": 0,
              "price": {
                "value": "1000.00",
                "currency": "AED"
              },
              "expired_at": "5 day",
              "images": [],
              "tags": [
                "ttt",
                "tto",
                "ppp"
              ],
              "created_at": "2016-08-08 08:06:33",
              "updated_at": "2016-08-08 08:06:33"
            },
          ],
          "token": null,
          "device_token": ""
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


##  Change User Avatar


```
 POST : /api/v1/users/changeAvatar (with token)
```

Name               | Type               | Required
-------------      | -------------      | -------------
id                 | int( id )          | true
avatar             | file( img )        | true

#### Success response example

```js
    {
      "id": 218,
      "email": "email@email.email",
      "country": "",
      "avatar": "uploads/avatars/users/218/first_name-avatar-57fce05ad4577.jpg",
      "company": "new",
      "biography": "test",
      "token": "",
      "expire_date": "2016-10-06 09:43:48 Etc/GMT",
      "type": 1,
      "product_id": "com.gss.monthly",
      "purchase_date": "2016-10-06 09:38:48 Etc/GMT",
      "transaction_id": "1000000240607432",
      "code": 200
    }
```

#### Failure response example

```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid avatar and id user"
    }
```    


##  Get Users Bay Phone Number And Email


```
 POST : /api/v1/users/getUsersByPhoneAndContact (with token)
```

Name               | Type                | Required
-------------      | -------------       | -------------
data[0][phone]     | int( phone number ) | false
data[0][email]     | string( email )     | false
data[1][phone]     | int( phone number ) | false
data[2][email]     | string( email )     | false

#### Success response example

```js
    {
      "data": [
        {
          "id": 3,
          "first_name": "first name",
          "last_name": "last name",
          "email": "test@test.tes",
          "country": "",
          "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
          "company_name": "company name",
          "biography": "biography",
          "url": "url",
          "telephone": "1234567899",
          "address": "test@test.tes",
          "is_active": true,
          "data": [
            {
              "id": 62,
              "title": "title",
              "description": "description",
              "access": 1,
              "price": {
                "value": "100.00",
                "currency": "AUD"
              },
              "expired_at": "361 day",
              "images": [
                {
                  "url": "uploads/posts/images/62/uuuuuuuu.png",
                  "width": 512,
                  "height": 506
                }
              ],
              "tags": [
                "tags",
                "tags"
              ],
              "created_at": "2016-07-22 07:10:02",
              "updated_at": "2016-09-01 12:56:23"
            }
          ],
          "token": null,
          "device_token": ""
        },
        {
          "id": 4,
          "first_name": "aaa",
          "last_name": "aaa",
          "email": "aaa@sdfs.fcv",
          "country": "",
          "avatar": "uploads/avatars/users/4/aaa-avatar-57ab011d0954c.png",
          "company_name": "acdsfc",
          "biography": "reyrhyrfh",
          "url": "dsvbgdsfvb",
          "telephone": "435456",
          "address": "api@pallitapp.com",
          "is_active": true,
          "data": [],
          "token": null,
          "device_token": ""
        },
        {
          "id": 24,
          "first_name": "test",
          "last_name": "test",
          "email": "test@test.com",
          "country": "",
          "avatar": "uploads/avatars/users/24/test-avatar-5799eb2502b6c.png",
          "company_name": "test@test.com",
          "biography": "test@test.com",
          "url": "test@test.com",
          "telephone": "6546465",
          "address": "api@pallitapp.com",
          "is_active": true,
          "data": [],
          "token": null,
          "device_token": ""
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


##  Check User Email Exist


```
 POST : /api/v1/checkEmail (without token)
```

Name                     | Type                         | Required
-------------            | -------------                | -------------
email                    | 	text(email)                 | true

#### Success response example

```js
{
  "code": 200,
  "success": true
}

{
  "code": 200,
  "success": false
}
   
```

#### Failure response example

```js
    {
      "code": 400,
      "success": false,
      "message": "Please enter a email"
    }
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid email address"
    }
```    


##  Check Post Limit


```
 GET : /api/v1/users/post/limit (with token)
```

#### Success response example

```js
    {
      "code": 200,
      "success": true,
      "message": "You are allowed to create a post."
    }     
```

#### Failure response example

```js
    {
      "code": 400,
      "success": false,
      "message": "You reached your post limit."
    }
```    


##  User Meta


```
 GET : /api/v1/users/meta (with token)
```

#### Success response example

```js
    {
      "sign_up_date": "11:44, 3 October 2016",
      "postings": 5,
      "messages_sent": 33,
      "messages_received": 3,
      "code": 200
    }     
```


##  User Info


```
 GET : /api/v1/users/{userId} (with token)
```

#### Success response example

```js
{
  "id": 35,
  "first_name": "testName",
  "last_name": "testName",
  "email": "test@email.com",
  "country": "",
  "avatar": "",
  "company_name": "super",
  "biography": "No Biography provided",
  "url": "No url provided",
  "telephone": "No telephone provided",
  "address": "No address provided",
  "is_active": true,
  "data": [
    {
      "id": 441,
      "title": "title",
      "description": "description",
      "access": 1,
      "price": {
        "value": "10.25",
        "currency": "AUD"
      },
      "expired_at": "38 day",
      "images": [
        {
          "url": "uploads/posts/images/441/fff.png",
          "width": 512,
          "height": 506
        },
        {
          "url": "uploads/posts/images/441/sss.png",
          "width": 512,
          "height": 506
        }
      ],
      "tags": [
        "sss",
        "rr"
      ],
      "conversation": [
        {
          "sender": 218,
          "recipient": 346
        }
      "created_at": "06:45, 12 October 2016",
      "updated_at": "06:45, 12 October 2016"
    }
  ],
  "token": null,
  "device_token": "",
  "expired_at": "",
  "code": 200
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


## Get User By Quickblox Ids


```
  POST : /api/v1/users/byQuickbloxIds (with token)
```

Name               | Type                     | Required
-------------      | -------------            | -------------
ids[0]             | text ( quickblox id )    | false
ids[1]             | text ( quickblox id )    | false
ids[2]             | text ( quickblox id )    | false

#### Success response example

```js
    {
      "data": [
        {
          "id": 425,
          "first_name": "",
          "last_name": "",
          "email": "test@email.email",
          "country": "country",
          "avatar": "uploads/avatars/users/425/-avatar-580d9feea9fe8.jpg",
          "company_name": "company",
          "biography": "biography",
          "url": "No url provided",
          "telephone": "No telephone provided",
          "address": "No address provided",
          "is_active": false,
          "data": [],
          "token": null,
          "device_token": "",
          "quickblox_id": 19487060,
          "expired_at": "2016-09-28 12:15:19 Etc/GMT"
        },
        {
          "id": 426,
          "first_name": "",
          "last_name": "",
          "email": "test2@email.email",
          "country": "country",
          "avatar": "uploads/avatars/users/426/-avatar-580d9ff8f0a78.jpg",
          "company_name": "company",
          "biography": "biography",
          "url": "No url provided",
          "telephone": "No telephone provided",
          "address": "No address provided",
          "is_active": false,
          "data": [],
          "token": null,
          "device_token": "",
          "quickblox_id": 19487066,
          "expired_at": "2016-09-28 12:15:19 Etc/GMT"
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