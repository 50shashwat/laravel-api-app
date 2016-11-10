<header>GET : /api/v1/posts</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    ........
  ]
}
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
  <pre>
      {
      "data": []
      }
    </pre>
</div>
