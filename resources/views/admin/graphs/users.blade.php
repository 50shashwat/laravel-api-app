@extends('layouts.admin')


@section('content')
    <logins-graph :url="'/graphs/users/logins'"></logins-graph>

    <registrations-graph :url="'/graphs/users/registrations'"></registrations-graph>
@endsection

@section('scripts')
    <script src="{{ elixir('js/graphs.js') }}"></script>
@endsection