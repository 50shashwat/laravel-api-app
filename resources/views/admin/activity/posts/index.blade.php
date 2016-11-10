@extends('admin.activity.activities')


@section('sub-content')
    <tbody id="activities-post">
        @each('admin.activity._activities', $activityType->activity, 'activity','admin.activity._empty')
    </tbody>
@endsection