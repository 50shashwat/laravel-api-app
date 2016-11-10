<header>GET : api/v1/users/favourites (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
</div>
