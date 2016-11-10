<header>POST : /api/v1/users/contacts (with token)</header>
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
    <td>contacts[0]</td>
    <td>text (numeric {contactId1})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>contacts[1]</td>
    <td>text (numeric {contactId2})</td>
    <td>true</td>
  </tr>
  <tr>
    <td>contacts[...]</td>
    <td>text (numeric {contactId...})</td>
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
          "message": "Your contact have been successfully deleted"
        }
    </pre>
</div>

<div class="alert-danger alert">
    <header>If contacts value isn't filled in</header>
    <pre>
      {
          "success": false,
          "message": {
                "contacts.1": [
                     "The contacts.1 field is required."
                ]
          }
      }
    </pre>
    <header>If contacts value isn't a number</header>
    <pre>
      {
          "success": false,
          "message": {
                "contacts.0": [
                     "The contacts.1 must be a number."
                ]
          }
      }
    </pre>
    <header>If contacts value isn't a valid</header>
    <pre>
        {
          "code": 400,
          "success": false,
          "message": "Please enter a valid contact id"
        }
    </pre>
</div>