<header>GET : /api/v1/users/conversations (with token)</header>

<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
{
  "data": [
    {
      "user_1": {
        "id": 218,
        "email": "email@email.email"
      },
      "user_2": {
        "id": 34,
        "email": "test@test.te12"
      },
      "post": {
        "id": 444,
        "user_id": 34,
        "title": "title",
        "access": 1,
        "price": "10.25",
        "currency": "AUD",
        "description": "description",
        "location": "location",
        "expired_at": "2016-10-28 16:28:28",
        "created_at": "06:45, 12 October 2016",
        "updated_at": "06:45, 12 October 2016",
        "deleted_at": null,
        "active": 1
      },
      "started": "09:28, 25 October 2016",
      "finished": "09:48, 25 October 2016"
    },
    {
      "user_1": {
        "id": 218,
        "email": "email@email.email"
      },
      "user_2": {
        "id": 34,
        "email": "test@test.te12"
      },
      "post": {
        "id": 441,
        "user_id": 35,
        "title": "title",
        "access": 1,
        "price": "10.25",
        "currency": "AUD",
        "description": "description",
        "location": "location",
        "expired_at": "2016-11-24 16:28:47",
        "created_at": "06:45, 12 October 2016",
        "updated_at": "06:45, 12 October 2016",
        "deleted_at": null,
        "active": 1
      },
      "started": "10:06, 25 October 2016",
      "finished": "11:15, 26 October 2016"
    }
  ]
}
    </pre>
</div>
