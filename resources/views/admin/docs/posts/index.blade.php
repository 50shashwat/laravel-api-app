@extends('layouts.docs')

@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-showallhome" aria-expanded="false">
                        Get all Posts (home)
                    </a>
                </h4>
            </div>
            <div id="posts-showallhome" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._showAllHome')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-showallSearch" aria-expanded="false">
                        Get search Posts
                    </a>
                </h4>
            </div>
            <div id="posts-showallSearch" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._showAllSearch')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-showall" aria-expanded="false">
                        Get all the Posts of the user
                    </a>
                </h4>
            </div>
            <div id="posts-showall" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._showAll')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-show" aria-expanded="false">
                        Get a user Posts
                    </a>
                </h4>
            </div>
            <div id="posts-show" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._show')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-create" aria-expanded="false">
                        Create Or Edit Posts
                    </a>
                </h4>
            </div>
            <div id="posts-create" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._create')
                </div>
            </div>
        </div>

        {{--<div class="panel panel-default">--}}
            {{--<div class="panel-heading">--}}
                {{--<h4 class="panel-title">--}}
                    {{--<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-edit" aria-expanded="false">--}}
                        {{--Edit Posts--}}
                    {{--</a>--}}
                {{--</h4>--}}
            {{--</div>--}}
            {{--<div id="posts-edit" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">--}}
                {{--<div class="panel-body">--}}
                    {{--@include('admin.docs.posts._edit')--}}
                {{--</div>--}}
            {{--</div>--}}
        {{--</div>--}}

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-delete" aria-expanded="false">
                        Delete Posts
                    </a>
                </h4>
            </div>
            <div id="posts-delete" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._delete')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-createRePosts" aria-expanded="false">
                        Create RePosts
                    </a>
                </h4>
            </div>
            <div id="posts-createRePosts" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._createRePosts')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-createNotification" aria-expanded="false">
                        Create Notification
                    </a>
                </h4>
            </div>
            <div id="posts-createNotification" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._posts-createNotification')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-getUserNotification" aria-expanded="false">
                        Get User Notifications
                    </a>
                </h4>
            </div>
            <div id="posts-getUserNotification" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._posts-getUserNotification')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-seeNotification" aria-expanded="false">
                        See Notification
                    </a>
                </h4>
            </div>
            <div id="posts-seeNotification" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.posts._posts-seeNotification')
                </div>
            </div>
        </div>

    </div>
@endsection