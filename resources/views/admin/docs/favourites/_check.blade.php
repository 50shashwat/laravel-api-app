<header>POST : /api/v1/users/favourites/check (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
  <thead>
  <th>Name</th>
  <th>Type</th>
  <th>Required</th>
  </thead>
  <tbody>
  <tr>
    <td>post_id</td>
    <td>int</td>
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
  "message": "This post is your favourites"
}
    </pre>
</div>
<div class="alert-danger alert">
  <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Please enter a valid post id"
}
    </pre>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "This post is not a Favourites"
}
    </pre>
</div>