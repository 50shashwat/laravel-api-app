<header>POST : /api/v1/users/contacts (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
  <thead>
  <th>Name</th>
  <th>Type</th>
  <th>Required</th>
  </thead>
  <tbody>
  <tr>
    <td>contacts[0]</td>
    <td>text (numeric {userId1} OR text {Email})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>contacts[1]</td>
    <td>text (numeric {userId2} OR text {Email})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>contacts[...]</td>
    <td>text (numeric {userId...} OR text {Email})</td>
    <td>true</td>
  </tr>
  </tbody>
</table>
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
        "company_name": "Apple",
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
    },
    {
      "status": "pending"
      "contact": {
        "id": 200,
        "first_name": "Jon",
        "last_name": "Green",
        "email": "test_email@email.email",
        "company_name": "Apple",
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
  .........
  ]
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If contacts value isn't filled in</header>
    <pre>
      {
          "success": false,
          "message": {
                "contacts.1": [
                     "The contacts.1 field is required."
                ]
          }
    }
    </pre>
    <header>If contacts value isn't a number</header>
    <pre>
      {
          "success": false,
          "message": {
                "contacts.0": [
                     "The contacts.1 must be a number."
                ]
          }
    }
    </pre>
</div>