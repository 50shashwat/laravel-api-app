<header>POST : /api/v1/users/groups (with token)</header>
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
  <tr>
    <td>groups[0]</td>
    <td>text (numeric {groupId1})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>groups[1]</td>
    <td>text (numeric {groupId2})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>groups[...]</td>
    <td>text (numeric {groupsId...})</td>
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
          "message": "Your groups have been successfully deleted"
        }
    </pre>
</div>

<div class="alert-danger alert">
    <header>If groups value isn't filled in</header>
    <pre>
      {
          "success": false,
          "message": {
                "groups.0": [
                     "The groups.0 field is required."
                ]
          }
      }
    </pre>
    <header>If groups value isn't a number</header>
    <pre>
      {
          "success": false,
          "message": {
                "groups.1": [
                     "The groups.1 must be a number."
                ]
          }
      }
    </pre>
    <header>If groups value isn't a valid</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid groups id"
        }
    </pre>
</div>