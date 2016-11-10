<header>GET : /api/v1/users/search (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>q</td>
        <td>text(First Name ,Last Name Or Email)</td>
        <td>true</td>
    </tr>
    </tbody>
</table>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "data": [
    {
      "id": 52,
      "first_name": "test",
      "last_name": "test",
      "email": "test@email.com",
      "country": "",
      "avatar": "",
      "company_name": "Google",
      "biography": "No Biography provided",
      "url": "No url provided",
      "telephone": "No telephone provided",
      "address": "No address provided",
      "is_active": true,
      "posts": [
        {
          "id": 68,
          "title": "test",
          "description": "eaWEFAWE",
          "access": 0,
          "price": {
            "value": "465.00",
            "currency": "AED"
          },
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "ssd",
            "sdds",
            "sdds"
          ],
          "created_at": "2016-08-08 07:05:09",
          "updated_at": "2016-08-08 07:05:09"
        },
        {
          "id": 69,
          "title": "test",
          "description": "eaWEFAWE",
          "access": 0,
          "price": {
            "value": "465.00",
            "currency": "AED"
          },
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "ssd",
            "sdds",
            "sdds"
          ],
          "created_at": "2016-08-08 07:08:46",
          "updated_at": "2016-08-08 07:08:46"
        },
        {
          "id": 70,
          "title": "test",
          "description": "eaWEFAWE",
          "access": 0,
          "price": {
            "value": "465.00",
            "currency": "AED"
          },
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "ssd",
            "sdds",
            "sdds"
          ],
          "created_at": "2016-08-08 07:14:18",
          "updated_at": "2016-08-08 07:14:18"
        },
        {
          "id": 71,
          "title": "test",
          "description": "yjtyjftyj",
          "access": 0,
          "price": {
            "value": "1000.00",
            "currency": "AED"
          },
          "expired_at": "5 day",
          "images": [],
          "tags": [
            "ttt",
            "tto",
            "ppp"
          ],
          "created_at": "2016-08-08 08:06:33",
          "updated_at": "2016-08-08 08:06:33"
        },
      ],
      "token": null,
      "device_token": ""
    }
  ]
}
    </pre>
</div>

<div class="alert-danger alert">
    <header>If text  not found</header>
    <pre>
{
  "data": []
}
    </pre>
</div>