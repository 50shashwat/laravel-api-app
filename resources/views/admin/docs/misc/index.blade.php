@extends('layouts.docs')

@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#posts-create" aria-expanded="false">
                        Get currencies
                    </a>
                </h4>
            </div>
            <div id="posts-create" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.misc.currencies')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#countries" aria-expanded="false">
                        Get countries
                    </a>
                </h4>
            </div>
            <div id="countries" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.misc.countries')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#user-create-payment" aria-expanded="false">
                        Create Payment
                    </a>
                </h4>
            </div>
            <div id="user-create-payment" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.misc._create_payment')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#become_premium" aria-expanded="false">
                        Become Premium
                    </a>
                </h4>
            </div>
            <div id="become_premium" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.misc._become_premium')
                </div>
            </div>
        </div>
    </div>
@endsection