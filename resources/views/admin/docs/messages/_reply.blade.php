<header>POST : api/v1/posts/{postId}/reply/{userId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>message</td>
        <td>text</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "sender": {
            "id": 2,
            "first_name": "Hrach",
            "last_name": "Tadevosyan",
            "email": "name@example.com",
            "is_active": true
          },
          "receiver": {
            "id": 1,
            "first_name": "Receiver",
            "last_name": "Receiver last_name",
            "email": "another@exampl.com",
            "is_active": true
          },
          "post": {
            "id": 1,
            "title": "Test title",
            "description": "Some description",
            "location": "Yerevan",
            "price": {
              "value": "10.25",
              "currency": "AUD"
            },
            "expired_at": "10 day"
          },
          "message": "Some text message test 2 ",
          "code": 200
        }
    </pre>
</div>
