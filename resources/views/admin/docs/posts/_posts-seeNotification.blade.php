<header>POST : /api/v1/posts/notification/see (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>not_id</td>
        <td>int( notification id )</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "id": 23,
  "user_id": 52,
  "post_id": 61,
  "is_see": true,
  "created_at": "2016-08-11 05:15:23",
  "updated_at": "2016-08-11 05:26:11",
  "code": 200
}
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Please enter a valid notification id"
}
    </pre>
</div>
