<header>POST : /api/v1/users/changeAvatar (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>id</td>
        <td>int( id )</td>
        <td>true</td>
    </tr>
    <tr>
        <td>avatar</td>
        <td>file( img )</td>
        <td>true</td>
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
  "token": "",
  "expire_date": "2016-10-06 09:43:48 Etc/GMT",
  "type": 1,
  "product_id": "com.gss.monthly",
  "purchase_date": "2016-10-06 09:38:48 Etc/GMT",
  "transaction_id": "1000000240607432",
  "code": 200
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If text  not found</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Please enter a valid avatar and id user"
}
    </pre>
</div>