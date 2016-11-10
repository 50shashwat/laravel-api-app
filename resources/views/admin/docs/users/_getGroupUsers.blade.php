<header>GET : /api/v1/users/groupusers/{groupId} (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
</div>

<div class="alert-danger alert">
    <header>If a group hasn't users</header>
    <pre>
      {
          "data": []
      }
    </pre>
</div>