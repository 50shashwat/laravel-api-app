<header>GET : /api/v1/posts/{postId} (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid post id"
        }
    </pre>
</div>
