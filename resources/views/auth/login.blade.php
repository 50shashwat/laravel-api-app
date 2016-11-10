<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="img/ico/favicon.png">
    <title>Login</title>

    <!-- Base Styles -->
    <link type="text/css" rel="stylesheet" href="{{ elixir('css/main-style.css') }}"/>
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="{{ elixir('js/ie.js') }}"></script>
    <![endif]-->
</head>
<body class="login-body">

<h2 class="form-heading">login</h2>
<div class="container log-row">
    <form class="form-signin" role="form" method="POST" action="{{ url('admin/login') }}">
        {!! csrf_field() !!}

        <div class="login-wrap">
            <input type="email" class="form-control" placeholder="Email address" name="email" value="{{ old('email') }}">
            @if ($errors->has('email'))
                <span class="help-block">
                    <strong>{{ $errors->first('email') }}</strong>
                </span>
            @endif
            <input type="password" class="form-control" name="password">
            @if ($errors->has('password'))
                <span class="help-block">
                    <strong>{{ $errors->first('password') }}</strong>
                </span>
            @endif
            <button class="btn btn-lg btn-success btn-block" type="submit">LOGIN</button>
            <label class="checkbox-custom check-success">
                <input type="checkbox" name="remember"> <label for="checkbox1">Remember me</label>
                <a class="pull-right" data-toggle="modal" href="#forgotPass"> Forgot Password?</a>
            </label>
        </div>
    </form>

    <!-- Modal -->
    <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="forgotPass" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Forgot Password ?</h4>
                </div>
                <div class="modal-body">
                    <p>Enter your e-mail address below to reset your password.</p>
                    <input type="text" name="email" placeholder="Email" autocomplete="off" class="form-control placeholder-no-fix">

                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancel</button>
                    <button class="btn btn-success" type="button">Submit</button>
                </div>
            </div>
        </div>
    </div>
    <!-- modal -->
</div>

<script src="{{ elixir('js/login.js') }}"></script>

</body>
</html>
