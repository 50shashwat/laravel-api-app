<header>POST : /api/v1/users/groups/{groupId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>name</td>
        <td>text </td>
        <td>true</td>
    </tr>
    <tr>
        <td>_method</td>
        <td>text (value PUT)</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "id": 25,
          "user_id": 3,
          "name": "group3",
          "created_at": "2016-07-18 08:15:59",
          "updated_at": "2016-07-18 08:15:59",
          "code": 200
        }
    </pre>
</div>

<div class="alert-danger alert">
    <header>If name value isn't filled in</header>
    <pre>
        {
          "success": false,
          "message": {
            "name": [
              "The name field is required."
            ]
          }
        }
    </pre>
</div>