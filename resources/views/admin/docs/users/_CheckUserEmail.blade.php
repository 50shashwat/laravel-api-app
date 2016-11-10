<header>POST : /api/v1/checkEmail (without token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>email</td>
        <td>text(email)</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "code": 200,
  "success": true
}

{
  "code": 200,
  "success": false
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Please enter a email"
}
{
  "code": 400,
  "success": false,
  "message": "Please enter a valid email address"
}
    </pre>
</div>