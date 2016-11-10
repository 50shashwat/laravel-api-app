@extends('layouts.admin')

@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/profile.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Create new user</header>
            </section>
            <div class="panel-body">
                <form role="form" action="{{ route('admin.users.create') }}" method="post" enctype="multipart/form-data">
                    {{ csrf_field() }}
                    <div class="form-group @if($errors->has('first_name')) has-error @endif">
                        <label for="first_name">First name</label>
                        <input type="text" class="form-control" name="first_name" value="{{ old('first_name') }}" id="first_name" placeholder="Enter first name">
                        @if($errors->has('first_name'))
                            <span class="help-block with-errors">{{ $errors->first('first_name') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('last_name')) has-error @endif">
                        <label for="last_name">Last name</label>
                        <input type="text" class="form-control" name="last_name" value="{{ old('last_name') }}" id="last_name" placeholder="Enter last name">
                        @if($errors->has('last_name'))
                            <span class="help-block with-errors">{{ $errors->first('last_name') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('email')) has-error @endif">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" name="email" id="email" value="{{ old('email') }}" placeholder="Enter email">
                        @if($errors->has('email'))
                            <span class="help-block with-errors">{{ $errors->first('email') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('type')) has-error @endif">
                        <label for="type">Type</label>
                        <select name="type" id="type" class="form-control">
                            <option value="0">Regular</option>
                            <option value="1">Premium</option>
                        </select>
                        @if($errors->has('type'))
                            <span class="help-block with-errors">{{ $errors->first('type') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('company_name')) has-error @endif">
                        <label for="company_name">Company name</label>
                        <input type="text" class="form-control" name="company_name" value="{{ old('company_name') }}" id="company_name" placeholder="Enter company name">
                        @if($errors->has('company_name'))
                            <span class="help-block with-errors">{{ $errors->first('company_name') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('url')) has-error @endif">
                        <label for="url">Company website url</label>
                        <input type="text" class="form-control" name="url" value="{{ old('url') }}" id="url" placeholder="Enter company website url">
                        @if($errors->has('url'))
                            <span class="help-block with-errors">{{ $errors->first('url') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('telephone')) has-error @endif">
                        <label for="telephone">Telephone</label>
                        <input type="text" class="form-control" name="telephone" value="{{ old('telephone') }}" id="telephone" placeholder="Enter telephone">
                        @if($errors->has('telephone'))
                            <span class="help-block with-errors">{{ $errors->first('telephone') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('address')) has-error @endif">
                        <label for="address">Address</label>
                        <input type="text" class="form-control" name="address" value="{{ old('address') }}" id="address" placeholder="Enter address">
                        @if($errors->has('address'))
                            <span class="help-block with-errors">{{ $errors->first('address') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('biography')) has-error @endif">
                         <label for="biography">Biography</label>
                        <textarea name="biography" id="biography" class="form-control" placeholder="Enter biography">{{ old('biography') }}</textarea>
                        @if($errors->has('biography'))
                            <span class="help-block with-errors">{{ $errors->first('biography') }}</span>
                        @endif
                    </div>
                    <div  id="datetimepicker"  class="form-group @if($errors->has('expired_at')) has-error @endif">
                        <label for="expired_at">Expired date</label>
                        <input class="form-control" name="expired_at" id="expired_at" type="text"></input>
                        <span class="add-on">
                             <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
                        </span>
                        @if($errors->has('expired_at'))
                            <span class="help-block with-errors">{{ $errors->first('expired_at') }}</span>
                        @endif
                    </div>

                    <div class="form-group @if($errors->has('password')) has-error @endif">
                        <label for="password">Password</label>
                        <input type="password" name="password" class="form-control" id="password" placeholder="Password">
                        @if($errors->has('password'))
                            <span class="help-block with-errors">{{ $errors->first('password') }}</span>
                        @endif
                    </div>
                    <div class="form-group">
                        <label class="checkbox-custom check-success">
                            <input type="checkbox" value="1" name="active" id="active"> <label for="active">Need to receive confirmation email</label>
                        </label>
                    </div>
                    <div class="form-group @if($errors->has('avatar')) has-error @endif">
                        <label for="avatar">Avatar</label>
                        <input id="avatar" class="file" name="avatar" type="file" multiple=true>
                        @if($errors->has('avatar'))
                            <span class="help-block with-errors">{{ $errors->first('avatar') }}</span>
                        @endif
                    </div>
                    <button type="submit" class="btn btn-info">Submit</button>
                </form>

            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ elixir('js/profile.js') }}"></script>
    <link rel="stylesheet" type="text/css" media="screen"
          href="http://tarruda.github.com/bootstrap-datetimepicker/assets/css/bootstrap-datetimepicker.min.css">
    <script type="text/javascript"
            src="http://tarruda.github.com/bootstrap-datetimepicker/assets/js/bootstrap-datetimepicker.min.js">
    </script>

    <script type="text/javascript">
        $('#datetimepicker').datetimepicker({
            format: 'dd/MM/yyyy',
            language: 'pt-BR',
            pickTime: false,
        });
    </script>
@endsection