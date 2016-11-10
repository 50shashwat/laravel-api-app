<header>GET : /api/v1/posts/me (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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


    ..........
  ]
}
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
      {
      "data": []
      }
    </pre>
</div>
