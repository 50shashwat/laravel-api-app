<header>POST : /api/v1/posts/notification  (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>post_id</td>
        <td>int( id )</td>
        <td>true</td>
    </tr>
    <tr>
        <td>user_id</td>
        <td>int( id )</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "id": 24,
  "user_id": 52,
  "post_id": 61,
  "is_see": false,
  "created_at": "2016-08-11 05:27:03",
  "updated_at": "2016-08-11 05:27:03",
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
  "message": "Please enter a valid data"
}
    </pre>
</div>
