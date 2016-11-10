@extends('layouts.admin')

@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/profile.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Edit group </header>
            </section>
            <div class="panel-body">
                <form role="form" action="{{ route('admin.users.updateGroup') }}" method="post" >
                    {{ csrf_field() }}

                    <input type="hidden" name="_method" value="PUT">

                    <div class="form-group ">
                        <label for="user_id">User: </label>
                        @foreach($user as $value)
                            <input type="hidden" name="user_id" value="{{ $value->id }}">
                            <h3>{{ $value->fullName() }}</h3>
                        @endforeach
                    </div>


                    <div class="form-group @if($errors->has('group_name')) has-error @endif">
                        <label for="first_name">Group name: </label>
                        <input type="hidden" name="group_id" value="{{ $group[0]->id }}">
                        <input type="text" class="form-control" name="group_name" value="{{ $group[0]->name }}" id="group_name" placeholder="Enter group name">
                        @if($errors->has('group_name'))
                            <span class="help-block with-errors">{{ $errors->first('group_name') }}</span>
                        @endif
                    </div>

                    <div class="form-group @if($errors->has('contact_id')) has-error @endif">
                        <label for="user_id">edit users to the group: </label>
                        <select class="form-control select2" name="contact_id[]"
                                value="{{ old('contact_id') }}" id="contact_id"
                                v-validate:user_id="['required']" multiple="true" placeholder="SELECT USERS"
                        >
                            @foreach($groupUsers as $user)
                                <option value="{{ $user->id }}" selected>{{ $user->first_name.' '.$user->last_name }}</option>
                            @endforeach
                                @foreach($users as $user)
                                    <option value="{{ $user->id }}">{{ $user->first_name.' '.$user->last_name }}</option>
                                @endforeach
                        </select>
                        <span v-if="$postCreateValidation.user_id.required">User required</span>
                        @if($errors->has('contact_id'))
                            <span class="help-block with-errors">{{ $errors->first('contact_id') }}</span>
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
    <script type="text/javascript">
        //        var text = document.getElementById('s2id_autogen1').value;
        //        console.log(text);
        $(document).ready(function () {
            var select = $('select.select2').select2({
                tags: true,
                createTag: function (params) {
                    if (params.term.indexOf('@') === -1) {
                        return null;
                    }

                    return {
                        id: params.term,
                        text: params.term
                    }
                }
            });
        });

    </script>
@endsection