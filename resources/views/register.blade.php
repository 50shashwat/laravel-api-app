<!DOCTYPE HTML>
<html>
<head>
    <title>Pallit App | Business to Business selling | iOS | Android</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
    <link href="{{elixir('css/app.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/main.css" />
    <!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
    <!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
</head>
<body>

<!-- Page Wrapper -->
<div id="page-wrapper">

    <!-- Wrapper -->
    <section id="wrapper">
        <h1><img src="images/logo-pallit.png" alt="Pallit App" class="images" style="max-width:300px;"></h1>
        <div class="inner">
            <form action="{{url('register')}}" method="POST">
                {!! csrf_field() !!}
                <input type="hidden" name="user_token" value="{{ isset($token) ? $token : ''}}">
                <div class="form-group {{ $errors->has('first_name') ? 'has-error' : '' }}">
                    <label for="first_name">First Name</label>
                    <input type="text" name="first_name" id="first_name" value="" class="form-control" >

                    <span class="help-block">{{ $errors->first('first_name') }}</span>
                </div>
                <div class="form-group {{ $errors->has('last_name') ? 'has-error' : '' }}">
                    <label for="last_name">Last Name</label>
                    <input type="text" name="last_name" id="last_name" value="" class="form-control" >
                    <span class="help-block">{{ $errors->first('last_name') }}</span>
                </div>
                <div class="form-group {{ $errors->has('email') ? 'has-error' : '' }}">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-control"   value="{{isset($email) ? $email : ''}}" >
                    <span class="help-block">{{ $errors->first('email') }}</span>
                </div>
                <div class="form-group {{ $errors->has('company_name') ? 'has-error' : '' }}">
                    <label for="company_name">Company name</label>
                    <input type="text" name="company_name" id="company_name" value="" class="form-control" >
                    <span class="help-block">{{ $errors->first('company_name') }}</span>
                </div>
                {{--<div class="form-group {{ $errors->has('permission') ? 'has-error' : '' }}">--}}
                    {{--<label for="permission">Permission</label>--}}
                    {{--<select name="permission" id="permission" class="form-control">--}}
                        {{--<option value="0">Regular</option>--}}
                        {{--<option value="1">Premium</option>--}}
                    {{--</select>--}}
                    {{--<span class="help-block">{{ $errors->first('permission') }}</span>--}}
                {{--</div>--}}
                <div class="form-group {{ $errors->has('password') ? 'has-error' : '' }}">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" value="" class="form-control" >
                    <span class="help-block">{{ $errors->first('password') }}</span>
                </div>
                <div class="form-group  {{ $errors->has('password_confirmation') ? 'has-error' : '' }}">
                    <label for="cpassword">Password confirm</label>
                    <input type="password" name="password_confirmation" id="cpassword" value="" class="form-control" >
                    <span class="help-block">{{ $errors->first('password_confirmation') }}</span>
                </div>
                <div class="form-group">
                    <input type="submit" id="submit" value="Register">
                    {{--<button id="next">--}}
                        {{--Next--}}
                    {{--</button>--}}
                </div>

            </form>
        </div>
    </section>
    <!-- Banner -->
    <section id="banner">
        <div class="inner">
            <div class="content">
                <ul>
                    <li><img src="images/pic01.jpg" alt="" /></li>
                    <li><img src="images/pic02.jpg" alt="" /></li>
                </ul>
            </div>
        </div>
    </section>

</div>
<script src="{{ elixir('js/app.js') }}" type="text/javascript"></script>
<!-- Scripts -->
<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
<script src="assets/js/main.js"></script>
<script>
//    $(document).ready(function () {
//        $('#permission').change(function () {
//            var perm = $('#permission').val();
//            if(perm == 1){
//                $('#submit').css('display','none');
//                $('#next').css('display','block');
//            }else{
//                $('#submit').css('display','block');
//                $('#next').css('display','none');
//            }
//        })
//
//    })
</script>
</body>
</html>