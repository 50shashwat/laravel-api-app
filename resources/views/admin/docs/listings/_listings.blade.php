<header>GET : api/v1/posts</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    </thead>
    <tbody>
    <tr>
        <td>title</td>
        <td>text (should be urldecoded)</td>
        <td>false</td>
    </tr>
    <tr>
        <td>tags</td>
        <td>text (example tags=tag1,tag2,tag3)</td>
        <td>false</td>
    </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        <p>Request is - http://bizit.dev/api/v1/search/posts?title=Test%20title&tags=tag4,tag2</p>
        Response is
        {
            "data": [
                {
                  "id": 1,
                  "title": "Test title",
                  "description": "Some description",
                  "location": "Yerevan",
                  "expired_at": "8 day",
                  "tags": [
                    "tag4"
                  ],
                  "user": {
                    "first_name": "Hrach",
                    "last_name": "Tadevosyan",
                    "email": "tadevosyanhrach@gmail.com",
                    "company_name": "No company name provided",
                    "biography": "No Biography provided",
                    "url": "No url provided",
                    "address": "No address provided",
                    "telephone": "No telephone provided"
                  }
                },
                {
                  "id": 2,
                  "title": "Test title",
                  "description": "Some description",
                  "location": "Yerevan",
                  "expired_at": "5 day",
                  "tags": {
                    "1": "tag2"
                  },
                  "user": {
                    "first_name": "Hrach",
                    "last_name": "Tadevosyan",
                    "email": "tadevosyanhrach1@gmail.com",
                    "company_name": "No company name provided",
                    "biography": "No Biography provided",
                    "url": "No url provided",
                    "address": "No address provided",
                    "telephone": "No telephone provided"
                  }
                },
                {
                   "id": 3,
                   "title": "Test title",
                   "description": "Some description",
                   "location": "Yerevan",
                   "expired_at": "68 day",
                   "tags": {
                     "1": "tag2"
                   },
                   "user": {
                     "first_name": "Hrach",
                     "last_name": "Tadevosyan",
                     "email": "tadevosyanhrac234h@gmail.com",
                     "company_name": "No company name provided",
                     "biography": "No Biography provided",
                     "url": "No url provided",
                     "address": "No address provided",
                     "telephone": "No telephone provided"
                   }
                }
            ]
        }
    </pre>
</div>
