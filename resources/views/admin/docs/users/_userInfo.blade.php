<header>GET : /api/v1/users/{userId} (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "id": 35,
  "first_name": "testName",
  "last_name": "testName",
  "email": "test@email.com",
  "country": "",
  "avatar": "",
  "company_name": "super",
  "biography": "No Biography provided",
  "url": "No url provided",
  "telephone": "No telephone provided",
  "address": "No address provided",
  "is_active": true,
  "data": [
    {
      "id": 441,
      "title": "title",
      "description": "description",
      "access": 1,
      "price": {
        "value": "10.25",
        "currency": "AUD"
      },
      "expired_at": "38 day",
      "images": [
        {
          "url": "uploads/posts/images/441/fff.png",
          "width": 512,
          "height": 506
        },
        {
          "url": "uploads/posts/images/441/sss.png",
          "width": 512,
          "height": 506
        }
      ],
      "tags": [
        "sss",
        "rr"
      ],
      "conversation": [
        {
          "sender": 218,
          "recipient": 346
        }
      "created_at": "06:45, 12 October 2016",
      "updated_at": "06:45, 12 October 2016"
    }
  ],
  "token": null,
  "device_token": "",
  "expired_at": "",
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
  "message": "Please enter a valid user id"
}
    </pre>
</div>