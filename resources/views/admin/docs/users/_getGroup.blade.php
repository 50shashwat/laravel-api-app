<header>GET : /api/v1/users/groups/{groupId} (with token)</header>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
      {
        "data": [
          {
            "id": 23,
            "user_id": 3,
            "name": "group1",
            "created_at": "2016-07-18 11:53:33",
            "updated_at": "2016-07-18 11:53:42"
          }
        ]
      }
    </pre>
</div>

<div class="alert-danger alert">
    <header>If a user hasn't groups</header>
    <pre>
      {
          "data": []
      }
    </pre>
    <header>If group id value isn't a valid</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid group id"
        }
    </pre>
</div>