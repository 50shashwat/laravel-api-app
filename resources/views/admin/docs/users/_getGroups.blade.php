<header>GET : /api/v1/users/groups (with token)</header>
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
          },
          {
            "id": 24,
            "user_id": 3,
            "name": "group2",
            "created_at": "2016-07-18 11:53:52",
            "updated_at": "2016-07-18 11:53:56"
          }
        .........
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
</div>