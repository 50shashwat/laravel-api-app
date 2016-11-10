<header>GET : /api/v1/users/contacts/{contactId} (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
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
    </pre>
</div>

<div class="alert-danger alert">
    <header>If a user hasn't a contact</header>
    <pre>
      {
          "data": []
      }
    </pre>
</div>