@extends('layouts.admin')

@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/dataTable.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">All Users</header>
                <table class="table responsive-data-table data-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Company name</th>
                            <th>Biography</th>
                            <th>Url</th>
                            <th>Telephone</th>
                            <th>Address</th>
                            <th>Type</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                       @foreach($users as $user)
                           <tr>
                               <td>{{ $user->id }}</td>
                               <td><a href="{{ route('admin.users.info',$user->id) }}">
                                       {{ $user->first_name }}</a></td>
                               <td>{{ $user->last_name }}</td>
                               <td>{{ $user->email }}</td>
                               <td>{{ $user->company_name }}</td>
                               <td>{{ $user->biography }}</td>
                               <td>{{ $user->url }}</td>
                               <td>{{ $user->telephone }}</td>
                               <td>{{ $user->address }}</td>
                               <td>{{ $user->type == 0 ? 'Regular' : 'Premium' }}</td>
                               <td><a href="{{ route('admin.users.info',$user->id) }}">
                                       <i class="fa fa-search"></i> </a> </td>
                           </tr>
                       @endforeach
                    </tbody>
                </table>
            </section>
        </div>
    </div>
@endsection
@section('scripts')
    <script type="text/javascript" src="{{ elixir('js/dataTable.js') }}"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            var select = $('select.select2').select2({
                tags: true,
                createTag: function (params) {
                    {{--if (params.term.indexOf('@') === -1) {--}}
                        {{--return null;--}}
                    {{--}--}}

                    return {
                        id: params.term,
                        text: params.term
                    }
                }
            });
        });

    </script>
@endsection