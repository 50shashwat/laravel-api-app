<header>POST : /api/v1/users/favourites (with token)</header>
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
          "id": 2,
          "first_name": "Hrach",
          "last_name": "Tadevosyan",
          "email": "tadevosyanhrach1@gmail.com",
          "biography": "No Biography provided",
          "company_name": "No company name provided",
          "url": "No url provided",
          "telephone": "No telephone provided",
          "address": "No address provided",
          "data": [
            {
              "id": 1,
              "user_id": 1,
              "title": "Test title",
              "description": "Some description",
              "location": "Yerevan",
              "access": 0,
              "price": {
                "value": "785.00",
                "currency": "AED"
              },
              "expired_at": "8 day",
              "created_at": "2016-05-11 01:58:27",
              "updated_at": "2016-05-11 01:58:27"
            }
          ],
          "code": 200
        }
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>

    </pre>
</div>
