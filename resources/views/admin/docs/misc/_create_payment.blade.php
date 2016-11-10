<header>POST : /api/v1/verifyReceipt (without token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>token</td>
        <td>text(base64(code))</td>
        <td>true</td>
    </tr>
    <tr>
        <td>secret_key</td>
        <td>text</td>
        <td>false</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "id": 3,
  "transaction_id": "1000000046178817",
  "product_id": "com.mindmobapp.download",
  "purchase_date": "2012-04-30 15:05:55 Etc/GMT",
  "expires_date": "2016-09-28 12:15:19 Etc/GMT",
  "code": 200
}
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
{
  "code": 400,
  "success": false,
  "message": "Receipt is not valid.  21002"
}
    </pre>
</div>
