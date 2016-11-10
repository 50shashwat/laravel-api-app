@extends('layouts.docs')

@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#get-favourites" aria-expanded="false">
                        Get user's favourite listings
                    </a>
                </h4>
            </div>
            <div id="get-favourites" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.favourites._get')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#mark-favourite" aria-expanded="false">
                        Mark listing as favourite for user
                    </a>
                </h4>
            </div>
            <div id="mark-favourite" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.favourites._createOrDelete')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#check-favourite" href="#check-favourite" aria-expanded="false">
                        Check post Favourites
                    </a>
                </h4>
            </div>
            <div id="check-favourite" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.favourites._check')
                </div>
            </div>
        </div>
        {{--<div class="panel panel-default">--}}
            {{--<div class="panel-heading">--}}
                {{--<h4 class="panel-title">--}}
                    {{--<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#createOrDelete" href="#createOrDelete" aria-expanded="false">--}}
                        {{--Create Or Delete Favourite--}}
                    {{--</a>--}}
                {{--</h4>--}}
            {{--</div>--}}
            {{--<div id="createOrDelete" class="panel-collapse collapse" aria-expanded="false">--}}
                {{--<div class="panel-body">--}}
                    {{--@include('admin.docs.favourites._createOrDelete')--}}
                {{--</div>--}}
            {{--</div>--}}
        {{--</div>--}}
    </div>
@endsection