<header>GET : /api/v1/users/posts?type=(0 or 1) (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
      <pre>
{
  "id": 207,
  "first_name": "Hrach",
  "last_name": "Tadevosyan",
  "email": "tadevosyanhrach@gmail.com",
  "company_name": "No company name provided",
  "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
  "biography": "No Biography provided",
  "url": "No url provided",
  "telephone": "No telephone provided",
  "address": "No address provided",
  "device_token": "",
  "data": [
    {
      "id": 434,
      "title": "title",
      "description": "description",
      "location": "location",
      "access": 1,
      "price": {
        "value": "10.25",
        "currency": "AUD"
      },
      "expired_at": "8 day",
      "created_at": "13:28, 23 September 2016",
      "updated_at": "13:32, 23 September 2016",
      "user": {

        "id": 207,
        "first_name": "Hrach",
        "last_name": "Tadevosyan",
        "email": "tadevosyanhrach@gmail.com",
        "company_name": "No company name provided",
        "avatar": "uploads/avatars/users/1/Hrach-avatar-5735f0368be30.jpg",
        "biography": "No Biography provided",
        "url": "No url provided",
        "telephone": "No telephone provided",
        "address": "No address provided",
        "device_token": "",
        "expired_at": "2 day"
      },
      "images": [],
      "tags": [
        "sss",
        "rr"
      ]
    }
  ],
  "expired_at": "2 day",
  "code": 200
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If user haven't posts</header>
    <pre>
      {
          "data": []
      }
    </pre>
</div>