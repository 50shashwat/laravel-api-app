<header>POST : /api/v1/users/groupusers/{groupId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>_method</td>
        <td>DELETE</td>
        <td>true</td>
    </tr>
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
      "code": 200,
      "success": true,
      "message": "Your selected users have been successfully deleted"
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
    <header>If you have exceeded the limit of group users</header>
  <pre>
      {
        "code": 400,
        "success": false,
        "message": "Please enter a valid user id"
      }
  </pre>

</div>