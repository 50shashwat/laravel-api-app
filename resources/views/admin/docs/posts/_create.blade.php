<header>POST : /api/v1/posts/create (with token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>id</td>
        <td>int(0 or user id for edit)</td>
        <td>true</td>
    </tr>
    <tr>
        <td>title</td>
        <td>text</td>
        <td>true</td>
    </tr>
    <tr>
        <td>access</td>
        <td>text ( value 0 if posts private, value 1 if posts public )</td>
        <td>true</td>
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
    <tr>
        <td>description</td>
        <td>text</td>
        <td>true</td>
    </tr>
    <tr>
        <td>location</td>
        <td>text </td>
        <td>true</td>
    </tr>
    <tr>
        <td>price</td>
        <td>text (decimal, example 10.25)</td>
        <td>true</td>
    </tr>
    <tr>
        <td>currency</td>
        <td>text (code ISO 4127 Standard, example "AUD")</td>
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
        <td>true</td>
    </tr>
    <tr>
        <td>tags</td>
        <td>text(separated by comma - i.e tag1,tag2,tag3 ....(if premium max available is 5 else 2))</td>
        <td>true</td>
    </tr>
    <tr>

        <td> for premium posts are without limit else 7 posts</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
          "id": 37,
          "title": "title",
          "access": "0",
          "repost_access": 1,
          "description": "descriptionc",
          "expired_at": "5 day",
          "price": {
            "value": "465544",
            "currency": "AUD"
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
          "tags": [],
          "created_at": "2016-07-19 08:30:37",
          "updated_at": "2016-07-19 08:30:37",
          "user": {
            "id": 3,
            "first_name": "first name",
            "last_name": "last name",
            "email": "test@test.tes",
            "company_name": "sdfdf",
            "avatar": "uploads/avatars/users/3/dvfdv-avatar-5785fd95dfb85.png",
            "biography": "biography",
            "url": "url",
            "telephone": "215454559",
            "address": "test@test.tes",
            "active": 1,
            "code": "",
            "created_at": "2016-07-13 08:36:37",
            "updated_at": "2016-07-13 08:36:37",
            "device_token": "",
            "country": "",
            "subscriptions": []
          },
          "conversation": [],
          "can_create_posts": 2,
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
    "access": [
      "The access field is required."
    ],
    "description": [
      "The description field is required."
    ],
    "location": [
      "The location field is required."
    ],
    "price": [
      "The price field is required."
    ],
    "currency": [
      "The currency field is required."
    ],
    "expired_at": [
      "The expired at field is required."
    ],
    "image": [
      "The image field is required."
    ]
  }
}
    </pre>
</div>
