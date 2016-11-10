<header>POST : /api/v1/login</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
        <th>Name</th>
        <th>Type</th>
        <th>Required</th>
    </thead>
    <tbody>
        <tr>
            <td>email</td>
            <td>email</td>
            <td>true</td>
        </tr>
        <tr>
            <td>password</td>
            <td>password</td>
            <td>true</td>
        </tr>
        <tr>
            <td>device_token</td>
            <td>text</td>
            <td>false</td>
        </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
    {
      "id": 218,
      "email": "email@email.email",
      "country": "",
      "avatar": "uploads/avatars/users/218/first_name-avatar-57fce05ad4577.jpg",
      "company": "new",
      "biography": "test",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIxOCwiaXNzIjoiaHR0cDpcL1wvYml6aXQuZGV2XC9hcGlcL3YxXC9sb2dpbiIsImlhdCI6MTQ3NzU0OTA0MCwiZXhwIjoxNDc3NTUyNjQwLCJuYmYiOjE0Nzc1NDkwNDAsImp0aSI6IjI2NzA1MjEzMTY2MmI1ZDliNDRhODU0NDFlNzgxMjk5In0.Z_ViJBZ2cJ5jOEn17durWq-NqOyWZ8AwKbm3mfBsxqk",
      "expire_date": "",
      "type": 0,
      "product_id": "",
      "purchase_date": "",
      "transaction_id": "",
      "quickblox_id": 19490385,
      "password": "f14718d3be9a1ffeac4a4b95cfffbde0",
      "code": 200
    }
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
        {
            "success": false,
            "message": {
            "email": [
                  "The email field is required."
                ]
            }
        }
    </pre>
    <pre>
       {
          "error": "invalid_credentials"
       }
    </pre>
</div>
