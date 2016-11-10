@extends('layouts.admin')

@section('content')

    @section('authorization')
        <header>Authorization: Bearer TOKEN</header>
        <br/> <p>Or</p> <br />
        <header>request_url?token=TOKEN</header>
        <br />
    @show

        @yield('sub-content')

@endsection