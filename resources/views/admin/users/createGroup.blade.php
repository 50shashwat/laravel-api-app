@extends('layouts.admin')

@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/profile.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Create new group for user</header>
            </section>
            <div class="panel-body">
                <form role="form" action="{{ route('admin.users.createGroup') }}" method="post" enctype="multipart/form-data">
                    {{ csrf_field() }}

                    <div class="form-group @if($errors->has('user_id')) has-error @endif">
                        <label for="user_id">User</label>
                        <select class="form-control select2" name="user_id"
                                value="{{ old('user_id') }}" id="user_id"
                                v-validate:user_id="['required']"
                        >
                            @foreach($users as $user)
                                <option value="{{ $user->id }}">{{ $user->fullName() }}</option>
                            @endforeach
                        </select>
                        <span v-if="$postCreateValidation.user_id.required">User required</span>
                        @if($errors->has('user_id'))
                            <span class="help-block with-errors">{{ $errors->first('user_id') }}</span>
                        @endif
                    </div>


                    <div class="form-group @if($errors->has('group_name')) has-error @endif">
                        <label for="first_name">Group name</label>
                        <input type="text" class="form-control" name="group_name" value="{{ old('group_name') }}" id="group_name" placeholder="Enter group name">
                        @if($errors->has('group_name'))
                            <span class="help-block with-errors">{{ $errors->first('group_name') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('contact_id')) has-error @endif">
                        <label for="user_id">Add users to the group</label>
                        <select class="form-control select2" name="contact_id[]"
                                value="{{ old('contact_id') }}" id="contact_id"
                                v-validate:user_id="['required']" multiple="true" placeholder="SELECT USERS"
                        >
                            @foreach($users as $user)
                                <option value="{{ $user->id }}">{{ $user->fullName() }}</option>
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
    <script>
        $(document).ready(function () {
            function getContacts() {
                var id = $('#user_id').val();
                $('#contact_id').html('');
                $.ajax({
                    url: '/user/getContactAjax/' + id,
                    type: 'GET',
                    success: function (data) {
                        $('#contact_id').html('');
                        for (i = 0; i < data.length; i++) {
                            $('#contact_id').append('<option value="' + data[i].contact_id + '">' + data[i].last_name + "   " + data[i].first_name + '</option>');
                        }
                    }
                })
            }
            $('#user_id').change(function () {

                getContacts();
            });
            getContacts();
        });


    </script>
@endsection