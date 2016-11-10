<header>GET : /api/v1/users/conversationsClose/{userId}/{postId} (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "code": 200,
  "success": true,
  "message": "You have successfully finished the conversation."
}
    </pre>
</div>
<div class="alert-danger alert">
  <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "No conversation"
}
    </pre>
</div>
