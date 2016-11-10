<header>GET : /api/v1/users/invite (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
</div>

<div class="alert-danger alert">
    <header>If there is no contact invitation</header>
    <pre>
        {
          "data": [ ]
        }
    </pre>
</div>