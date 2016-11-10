<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="csrf-token" id="token" value="{{ csrf_token() }}" />
    <title>BizIt admin panel</title>

    <link href="{{elixir('css/app.css')}}" rel="stylesheet">

    @yield('styles')

    <!--[if lt IE 9]>
    <script src="{{ elixir('js/ie.js') }}"></script>
    <![endif]-->
</head>

<body class="sticky-header">

<section>
    @include('layouts._left_menu')

    <div class="body-content" >
        @include('layouts._top_header')

        <!-- page head start-->
            {{--@include('layouts._page_head')--}}
        <!-- page head end-->

        <div class="wrapper">
            @yield('content')
        </div>

        <footer>
            {{ date('Y') }} &copy; BizIt admin panel
        </footer>
    </div>
</section>

<script src="{{ elixir('js/app.js') }}" type="text/javascript"></script>
@yield('scripts')

</body>
</html>
