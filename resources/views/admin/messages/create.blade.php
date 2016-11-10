@extends('layouts.admin')

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Create new message</header>
            </section>
            <div class="panel-body">
                <form role="form" action="{{ route('admin.messages.create') }}" method="post">
                    {{ csrf_field() }}
                    <div class="form-group @if($errors->has('sender_id')) has-error @endif">
                        <label for="sender_id">Sender user</label>
                        <select class="form-control" name="sender_id" value="{{ old('sender_id') }}" id="sender_id">
                            @foreach($users as $user)
                                <option value="{{ $user->id }}">{{ $user->fullName() }}</option>
                            @endforeach
                        </select>
                        @if($errors->has('user_id'))
                            <span class="help-block with-errors">{{ $errors->first('user_id') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('receiver_id')) has-error @endif">
                        <label for="receiver_id">Receiver user</label>
                        <select class="form-control" name="receiver_id" value="{{ old('receiver_id') }}" id="receiver_id">
                            @foreach($users as $user)
                                {{--<option value="{{ $user->id }}">{{ $user->fullName() }}</option>--}}
                            @endforeach
                        </select>
                        @if($errors->has('receiver_id'))
                            <span class="help-block with-errors">{{ $errors->first('receiver_id') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('post_id')) has-error @endif">
                        <label for="post_id">Select the post</label>
                        <select class="form-control" name="post_id" value="{{ old('post_id') }}" id="post_id">
                            @foreach($posts as $post)
                                {{--<option value="{{ $post->id }}">{{ $post->title }}</option>--}}
                            @endforeach
                        </select>
                        @if($errors->has('post_id'))
                            <span class="help-block with-errors">{{ $errors->first('post_id') }}</span>
                        @endif
                    </div>
                    <div class="form-group @if($errors->has('text')) has-error @endif">
                        <label for="text">Message</label>
                        <textarea type="text" class="form-control" name="text" id="text" placeholder="Enter message">{{ old('text') }}</textarea>
                        @if($errors->has('text'))
                            <span class="help-block with-errors">{{ $errors->first('text') }}</span>
                        @endif
                    </div>
                    <button type="submit" class="btn btn-info">Submit</button>
                </form>

            </div>
        </div>
    </div>

@endsection
@section('scripts')
<script>
    $(document).ready(function () {
        function getContacts() {
            var id = $('#sender_id').val();

            $.ajax({
                url: '/user/getUsersAjax/' + id,
                type: 'GET',
                success: function (data) {
                    $('#receiver_id').html('');
                    for (var i = 0; i < data.length; i++) {
                        $('#receiver_id').append('<option value="' + data[i].id  + '">' + data[i].last_name + "   " + data[i].first_name + '</option>');
                    }
                    getPosts();
                }
            })

        }

        getContacts();

        function getPosts() {
            var id = $('#receiver_id').val();

            $('#post_id').html('');
            $.ajax({
                url: '/user/getPostsAjax/' + id,
                type: 'GET',
                success: function (data) {
                    $('#post_id').html('');
                    for (var i = 0; i < data.length; i++) {
                        $('#post_id').append('<option value="' + data[i].id + '">' + data[i].title + '</option>');
                    }
                }
            })
        }
        $('#receiver_id').change(function () {
            getPosts();
        });
        $('#sender_id').change(function () {

            getContacts();
            getPosts();
        });
    });
</script>
@endsection