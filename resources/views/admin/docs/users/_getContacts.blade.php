<header>GET : /api/v1/users/contacts (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
  .........
  ]
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If a user hasn't contacts</header>
    <pre>
      {
          "data": []
      }
    </pre>
</div>