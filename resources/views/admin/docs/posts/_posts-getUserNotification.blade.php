<header>GET : /api/v1/posts/notification/{userid} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "data": [
    {
      "id": 2,
      "user_id": 52,
      "post_id": 59,
      "is_see": 0,
      "created_at": "2016-08-10 08:03:48",
      "updated_at": "2016-08-10 08:07:50"
    },
    {
      "id": 4,
      "user_id": 52,
      "post_id": 60,
      "is_see": 0,
      "created_at": "2016-08-10 08:04:15",
      "updated_at": "2016-08-10 08:08:36"
    },
    {
      "id": 24,
      "user_id": 52,
      "post_id": 61,
      "is_see": 0,
      "created_at": "2016-08-11 05:27:03",
      "updated_at": "2016-08-11 05:27:03"
    }
  ]
}
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Please enter a valid user id"
}
    </pre>
</div>
