<header>POST : /api/v1/users/groupusers/{groupId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
  <thead>
  <th>Name</th>
  <th>Type</th>
  <th>Required</th>
  </thead>
  <tbody>
  <tr>
    <td>userIds[0]</td>
    <td>text (numeric {userId1})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>userIds[1]</td>
    <td>text (numeric {userId2})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>userIds[...]</td>
    <td>text (numeric {usersId...})</td>
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
        "avatar": "uploads/avatars/users/2/test-avatar-5784e73a71c32.png",
        "device_token": ""
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
        "avatar": "uploads/avatars/users/1/testing-avatar-57835501650c7.png",
        "device_token": ""
      },
      "created_at": "2016-07-18 12:03:47",
      "updated_at": "2016-07-18 12:03:47"
    }
  ]
}
    </pre>
</div>

<div class="alert-danger alert">
  <header>If userIds value isn't filled in</header>
    <pre>
      {
          "success": false,
          "message": {
                "groups.0": [
                     "The groups.0 field is required."
                ]
          }
      }
    </pre>
  <header>If userIds value isn't a number</header>
    <pre>
      {
          "success": false,
          "message": {
                "groups.1": [
                     "The groups.1 must be a number."
                ]
          }
      }
    </pre>

</div>