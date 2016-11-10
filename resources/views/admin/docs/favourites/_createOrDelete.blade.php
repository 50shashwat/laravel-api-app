<header>GET : /api/v1/users/favourites/{postId} (with token)</header>
<div class="alert-success alert">
  <header>Success response example</header>
    <pre>
{
  "code": 200,
  "success": true,
  "message": "Successfully added to favorite"
}

{
  "code": 403,
  "success": false,
  "message": "Successfully removed from favorite"
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
</div>