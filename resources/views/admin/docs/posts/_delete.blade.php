<header>POST : /api/v1/posts/{postId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>_method</td>
        <td>DELETE</td>
        <td>true</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "code": 200,
          "success": true,
          "message": "Your Posts have been successfully deleted"
        }
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid post id"
        }
    </pre>
</div>
