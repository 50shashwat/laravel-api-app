@extends('layouts.admin')

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Users activities</header>
                <table class="table responsive-data-table data-table">
                    <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>User</th>
                        <th>Message</th>
                        <th>Ip</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    @yield('sub-content')
                </table>
            </section>
        </div>
    </div>

@endsection

@section('scripts')
    <script src="{{ elixir('js/activities.js') }}"></script>
@endsection