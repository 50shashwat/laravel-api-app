  * [Get user favourite listings](#get-user-favourite-listings)
  * [Check post Favourites](#check-post-favourites)
  * [Mark listing as favourite for user](#mark-listing-as-favourite-for-user)

  
 
 
##  Get user favourite listings
  
  
```
      GET : api/v1/users/favourites (with token)
```
    
#### Success response example
    
```json
    {
      "id": 3,
      "first_name": "Hrach",
      "last_name": "Tadevosyan",
      "email": "tadevosyanhrac234h@gmail.com",
      "avatar": "uploads/avatars/users/89/test-avatar-57da7e85211ec.png",
      "biography": "No Biography provided",
      "company_name": "No company name provided",
      "url": "No url provided",
      "telephone": "No telephone provided",
      "address": "No address provided",
      "data": [
        {
          "id": 1,
          "user_id": 1,
          "title": "Test title",
          "description": "Some description",
          "location": "Yerevan",
          "access": 0,
          "price": {
            "value": "785.00",
            "currency": "AED"
          },
          "expired_at": "7 day",
          "created_at": "2016-05-11 01:58:27",
          "updated_at": "2016-05-11 01:58:27"
        },
        {
          "id": 2,
          "user_id": 2,
          "title": "Test title",
          "description": "Some description",
          "location": "Yerevan",
          "access": 1,
          "price": {
            "value": "785.00",
            "currency": "AED"
          },
          "expired_at": "10 day",
          "created_at": "2016-05-11 01:59:34",
          "updated_at": "2016-05-11 01:59:34"
        }
      ],
      "code": 200
    }
```
    
    
##  Mark listing as favourite for user


```
    GET : /api/v1/users/favourites/{postId} (with token)
```
  
#### Success response example
  
```json
    {
      "code": 200,
      "success": true,
      "message": "Successfully added to favorite"
    }
    
    {
      "code": 403,
      "success": false,
      "message": "Successfully removed from favorite"
    }
```
  
#### Failure response example
  
```json
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid post id"
    }
```    


##  Check post Favourites


```
    POST : /api/v1/users/favourites/check (with token)
```
  
  Name            | Type              | Required
  -------------   | -------------     | -------------
  post_id         | int               | true

#### Success response example
  
```json
    {
      "code": 200,
      "success": true,
      "message": "This post is your favourites"
    }
```
  
#### Failure response example
  
```json
    {
      "code": 400,
      "success": false,
      "message": "Please enter a valid post id"
    }
        
    {
      "code": 400,
      "success": false,
      "message": "This post is not a Favourites"
    }
```