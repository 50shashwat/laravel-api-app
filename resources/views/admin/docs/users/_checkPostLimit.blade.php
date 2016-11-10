<header>GET : /api/v1/users/post/limit (with token)</header>


<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "code": 200,
  "success": true,
  "message": "You are allowed to create a post."
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If text  not found</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "You reached your post limit."
}
    </pre>
</div>