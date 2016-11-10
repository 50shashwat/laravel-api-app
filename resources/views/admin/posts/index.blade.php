@extends('layouts.admin')

@section('content')
    <div id="posts">
        <posts></posts>
    </div>
@endsection

@section('scripts')
    <script src="{{ elixir('js/posts.js') }}"></script>
@endsection