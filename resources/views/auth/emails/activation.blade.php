<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Hello {{$user->first_name}} {{$user->last_name}}</h1>
    <p>Thanks for registrating in our service</p>
    <p>The last step is just to confirm that this is your email address</p>
    <p>Please click on link below,or copy-paste to the browser's address bar</p>
    <p><a href="{{ route('activate',$code) }}">{{ route('activate',$code) }}</a> </p>
</body>
</html>