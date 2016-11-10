@extends('layouts.admin')

@section('content')
<div class="row state-overview">
    <div class="col-lg-3 col-sm-6">
        <section class="panel purple">
            <div class="symbol">
                <i class="fa fa-users"></i>
            </div>
            <div class="value white">
                <a href="/users">
                    <h1 class="timer" data-from="0" data-to="{{ $usersCount }}"
                        data-speed="1000">
                        <!--320-->
                    </h1>
                </a>
                <p>Users</p>
            </div>
        </section>
    </div>
</div>
<!--state overview end-->

@endsection