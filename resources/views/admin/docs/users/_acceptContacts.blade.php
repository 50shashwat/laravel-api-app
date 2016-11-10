<header>GET : /api/v1/users/contacts/accept/{contactId} (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "code": 200,
          "success": true,
          "message": "You accepted contact"
        }
    </pre>
</div>

<div class="alert-danger alert">
    <header>If user id  value isn't filled in</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid user id"
        }
    </pre>
</div>