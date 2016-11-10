@extends('layouts.admin')

@section('styles')
    <link href="{{elixir('css/profile.css')}}" rel="stylesheet">
@endsection

@section('content')
    <div class="row">
        <div class="col-lg-6">
            <section class="panel">
                <header class="panel-heading">
                   Update profile
                </header>
                <div class="panel-body">
                    <form role="form" action="{{ route('admin.profile',$admin->id) }}" method="post" enctype="multipart/form-data">
                        {!! csrf_field() !!}
                        {!! method_field('put') !!}

                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" name="email" class="form-control" id="email" value="{{ $admin->email }}">
                            @if ($errors->has('email'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" class="form-control" id="name" value="{{ $admin->name }}">
                        </div>
                        <div class="form-group">
                            <label for="new-pass">New password</label>
                            <input type="password" name="password" class="form-control" id="new-pass" placeholder="New password">
                            @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label for="new-pass-repeat">New password repeat</label>
                            <input type="password" name="password_confirmation" class="form-control" id="new-pass-repeat" placeholder="New password repeat">
                        </div>
                        <div class="form-group">
                            <label for="avatar">File input</label>
                            <input name="avatar" id="avatar" class="file" type="file">

                            <p class="help-block">Only jpg,jpeg or png</p>
                            @if ($errors->has('avatar'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('avatar') }}</strong>
                                </span>
                            @endif
                        </div>

                        <button type="submit" class="btn btn-info">Update</button>
                    </form>

                </div>
            </section>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ elixir('js/profile.js') }}" type="text/javascript"></script>

    @if(session()->has('profileUpdate'))
        <script type="text/javascript">
            swal("Good job!", "Profile data has been updated", "success")
        </script>
    @endif
@endsection