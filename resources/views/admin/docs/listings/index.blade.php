@extends('layouts.docs')
@section('authorization')
    <header>No authorization is required</header>
@endsection
@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#listings" aria-expanded="false">
                        Get listings
                    </a>
                </h4>
            </div>
            <div id="listings" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.listings._listings')
                </div>
            </div>
        </div>
    </div>
@endsection