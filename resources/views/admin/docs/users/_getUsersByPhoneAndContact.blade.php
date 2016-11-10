<header>POST : /api/v1/users/getUsersByPhoneAndContact (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>data[0][phone]</td>
        <td>int( phone number )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>data[0][email]</td>
        <td>string( email )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>data[1][phone]</td>
        <td>int( phone number )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>data[2][email]</td>
        <td>string( email )</td>
        <td>false</td>
    </tr>
    </tbody>
</table>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "data": [
    {
      "id": 3,
      "first_name": "first name",
      "last_name": "last name",
      "email": "test@test.tes",
      "country": "",
      "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
      "company_name": "company name",
      "biography": "biography",
      "url": "url",
      "telephone": "1234567899",
      "address": "test@test.tes",
      "is_active": true,
      "data": [
        {
          "id": 62,
          "title": "title",
          "description": "description",
          "access": 1,
          "price": {
            "value": "100.00",
            "currency": "AUD"
          },
          "expired_at": "361 day",
          "images": [
            {
              "url": "uploads/posts/images/62/uuuuuuuu.png",
              "width": 512,
              "height": 506
            }
          ],
          "tags": [
            "tags",
            "tags"
          ],
          "created_at": "2016-07-22 07:10:02",
          "updated_at": "2016-09-01 12:56:23"
        }
      ],
      "token": null,
      "device_token": ""
    },
    {
      "id": 4,
      "first_name": "aaa",
      "last_name": "aaa",
      "email": "aaa@sdfs.fcv",
      "country": "",
      "avatar": "uploads/avatars/users/4/aaa-avatar-57ab011d0954c.png",
      "company_name": "acdsfc",
      "biography": "reyrhyrfh",
      "url": "dsvbgdsfvb",
      "telephone": "435456",
      "address": "api@pallitapp.com",
      "is_active": true,
      "data": [],
      "token": null,
      "device_token": ""
    },
    {
      "id": 24,
      "first_name": "test",
      "last_name": "test",
      "email": "test@test.com",
      "country": "",
      "avatar": "uploads/avatars/users/24/test-avatar-5799eb2502b6c.png",
      "company_name": "test@test.com",
      "biography": "test@test.com",
      "url": "test@test.com",
      "telephone": "6546465",
      "address": "api@pallitapp.com",
      "is_active": true,
      "data": [],
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