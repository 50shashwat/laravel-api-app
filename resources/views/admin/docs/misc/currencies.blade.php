<header>GET : api/v1/currencies (without token)</header>
<table class="table tab-pane tab-dark " style="color: white">
    <thead>
        <th>Name</th>
        <th>Type</th>
        <th>Required</th>
    </thead>
    <tbody>
        <tr>
            <td colspan="3" class="text-center">No parameters</td>
        </tr>
    </tbody>
</table>
<div class="alert-success alert">
    <header>Success response example</header>
    <pre>
        {
            "success" => true,
            "code": 200,
            "data":[
                {
                    "name": "Armenian Dram",
                    "alpha3": "AMD",
                    "numeric": "051",
                    "exp": "2",
                    "country": "AM",
                },
                    ... ...
                    ... ...
                {
                    "name": "Pound Sterling",
                    "alpha3": "GBP",
                    "numeric": "826",
                    "exp": "2",
                    "country": [
                      "GB",
                      "GG",
                      "GS",
                      "IM",
                      "IO",
                      "JE",
                      "ZW"
                    ]
                }
            ]
        }
    </pre>
</div>
<div class="alert-danger alert">
    <header>Failure response example</header>
    <pre>
        {
            "success": false,
            "error":{
                "code": Some code,
                "message": "Some message"
            }
        }
    </pre>
</div>
