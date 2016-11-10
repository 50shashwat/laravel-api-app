<header>POST : /api/v1/register</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
        <th>Name</th>
        <th>Type</th>
        <th>Required</th>
    </thead>
    <tbody>
        {{--<tr>--}}
            {{--<td>first_name</td>--}}
            {{--<td>text</td>--}}
            {{--<td>true</td>--}}
        {{--</tr>--}}
        {{--<tr>--}}
            {{--<td>last_name</td>--}}
            {{--<td>text</td>--}}
            {{--<td>true</td>--}}
        {{--</tr>--}}
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
            <td>avatar</td>
            <td>image (mimes:jpeg,png) </td>
            <td>true</td>
        </tr>
        <tr>
            <td>type</td>
            <td>int (0,1) </td>
            <td>true</td>
        </tr>
        <tr>
            <td>transaction_id</td>
            <td>text</td>
            <td>false(if type == 1 (true))</td>
        </tr>
        <tr>
            <td>purchase_date</td>
            <td>text</td>
            <td>false(if type == 1 (true))</td>
        </tr>
        <tr>
            <td>product_id</td>
            <td>text</td>
            <td>false(if type == 1 (true))</td>
        </tr>
        <tr>
            <td>expired_at</td>
            <td>text </td>
            <td>false(if type == 1 (true))</td>
        </tr>
        <tr>
            <td>company_name</td>
            <td>text</td>
            <td>false</td>
        </tr>
        <tr>
            <td>biography</td>
            <td>text</td>
            <td>false</td>
        </tr>
        <tr>
            <td>url</td>
            <td>text</td>
            <td>false</td>
        </tr>
        <tr>
            <td>telephone</td>
            <td>text</td>
            <td>false</td>
        </tr>
        <tr>
            <td>address</td>
            <td>text</td>
            <td>false</td>
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
                "first_name": [
                  "The first name field is required."
                ],
                "last_name": [
                  "The last name field is required."
                ],
                "email": [
                  "The email field is required."
                ],
                "password": [
                  "The password field is required."
                ],
                "password_confirmation": [
                  "The password confirmation field is required."
                ]
            }
        }
    </pre>
</div>