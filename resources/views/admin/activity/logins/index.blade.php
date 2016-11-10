@extends('admin.activity.activities')


@section('sub-content')
    <tbody id="activities-login">
        @each('admin.activity._activities', $activityType->activity, 'activity','admin.activity._empty')
    </tbody>
@endsection