@extends('admin.activity.activities')


@section('sub-content')
    <tbody id="activities-register">
        @each('admin.activity._activities', $activityType->activity, 'activity','admin.activity._empty')
    </tbody>
@endsection