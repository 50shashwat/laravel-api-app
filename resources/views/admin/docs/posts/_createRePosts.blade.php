<header>POST : /api/v1/posts/reposts/{postId} (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>title</td>
        <td>text</td>
        <td>true</td>
    </tr>
    <tr>
        <td>description</td>
        <td>text</td>
        <td>true</td>
    </tr>
    <tr>
        <td>expired_at</td>
        <td>text(5 day)</td>
        <td>true</td>
    </tr>
    <tr>
        <td>image[ ]</td>
        <td>file(mimes:jpeg,jpg,png)</td>
        <td>false</td>
    </tr>
    <tr>
        <td>tags</td>
        <td>text(separated by comma - i.e tag1,tag2,tag3 ....)</td>
        <td>false</td>
    </tr>
    <tr>
        <td>privacy[contact][0]</td>
        <td>text (integer contactId1 (if access value is 0 )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>privacy[contact][1]</td>
        <td>text (integer contactId2 (if access value is 0 )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>privacy[group][0]</td>
        <td>text (integer groupId1 (if access value is 0 )</td>
        <td>false</td>
    </tr>
    <tr>
        <td>privacy[group][1]</td>
        <td>text (integer groupId2 (if access value is 0 )</td>
        <td>false</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "id": 57,
          "title": "title111",
          "access": 0,
          "repost_access": 1,
          "description": "descriptionc",
          "expired_at": "5 day",
          "price": {
            "value": "65.00",
            "currency": "AED"
          },
          "images": [
            {
              "url": "uploads/posts/images/197/sss.png",
              "width": 512,
              "height": 506
            },
            {
              "url": "uploads/posts/images/197/uuuuuuuu.png",
              "width": 512,
              "height": 506
            }
          ],
          "tags": [
            "sfsdffdhgfrh",
            "htgfhfgd",
            "f5b5fcb14"
          ],
          "created_at": "2016-07-21 08:37:55",
          "updated_at": "2016-07-21 08:37:55",
          "user": {
            "id": 3,
            "first_name": "first name",
            "last_name": "last name",
            "email": "test@test.tes",
            "company_name": "company name",
            "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
            "biography": "biography",
            "url": "url",
            "telephone": "1234567899",
            "address": "test@test.tes",
            "active": 1,
            "code": "",
            "created_at": "2016-07-13 08:36:37",
            "updated_at": "2016-07-13 08:36:37",
            "device_token": "",
            "country": "",
            "subscriptions": []
          },
          "conversation": []
          "can_create_posts": 3,
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
    "privacy.contact.0": [
      "The privacy.contact.0 must be a number."
    ],
    "privacy.group.0": [
      "The privacy.group.0 must be a number."
    ],
    "title": [
      "The title field is required."
    ],
    "description": [
      "The description field is required."
    ]
  }
}
{
  "code": 400,
  "success": false,
  "message": " The limit of tags has been exceeded"
}
{
  "code": 400,
  "success": false,
  "message": "You are not a Premium User"
}
    </pre>
</div>
