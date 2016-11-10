<header>POST : /api/v1/user (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>_method</td>
        <td>PUT</td>
        <td>true</td>
    </tr>
    {{--<tr>--}}
        {{--<td>first_name</td>--}}
        {{--<td>text</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    {{--<tr>--}}
        {{--<td>last_name</td>--}}
        {{--<td>text</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    {{--<tr>--}}
        {{--<td>email</td>--}}
        {{--<td>email</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    <tr>
        <td>old password</td>
        <td>password</td>
        <td>false</td>
    </tr>
    <tr>
        <td>password</td>
        <td>password</td>
        <td>false</td>
    </tr>
    {{--<tr>--}}
        {{--<td>password_confirmation</td>--}}
        {{--<td>password (same as password)</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    <tr>
        <td>avatar</td>
        <td>image (mimes:jpeg,png) </td>
        <td>false</td>
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
    {{--<tr>--}}
        {{--<td>url</td>--}}
        {{--<td>text</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    {{--<tr>--}}
        {{--<td>telephone</td>--}}
        {{--<td>text</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    {{--<tr>--}}
        {{--<td>address</td>--}}
        {{--<td>text</td>--}}
        {{--<td>false</td>--}}
    {{--</tr>--}}
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
"id": 172,
"email": "mac@gmail.com",
"country": "United States",
"avatar": "",
"company": "Mac OS",
"biography": "No Biography provided",
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
"expire_date": "",
"type": 0,
"product_id": "",
"purchase_date": "",
"transaction_id": "",
"code": 200
}



{
"id": 172,
"email": "mac@gmail.com",
"country": "United States",
"avatar": "",
"company": "Mac OS",
"biography": "No Biography provided",
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MiwiaXNzIjoiaHR0cDpcL1wvd3d3LnBhbGxpdGFwcC5jb21cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNDc2MTY0Mzg5LCJleHAiOjE0NzYxNjc5ODksIm5iZiI6MTQ3NjE2NDM4OSwianRpIjoiMGI1MzZjYThmOTcxNDJjY2FiZjM0MTdjNGI0YWYzMDcifQ.4oKnmsOuJDz5widmRgOwJQ3oM8NiPiMlVu9UKSVnW48",
"expire_date": "2016-09-28 12:00:19 Etc/GMT",
"type": 1,
"product_id": "com.gss.monthly",
"purchase_date": "2016-09-28 12:00:19 Etc/GMT",
"transaction_id": "1000000241330879",
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
                password": [
                  "The password field is required."
                ],
                "password_confirmation": [
                  "The password confirmation field is required."
                ]
            }
        }
    </pre>
</div>