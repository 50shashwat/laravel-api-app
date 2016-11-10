@extends('layouts.admin')
@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/profile.css') }}" />
@endsection
@section('content')
    <div class="profile-hero">
        <div class="profile-intro">
            <img src="{{ $user->getAvatarImage()}}" alt="">
            <h1>{{ $user->fullName() }}</h1>
        </div>
        <div class="profile-value-info">
            <div class="info">
                <span>{{ $user->posts->count() }}</span>
                Posts
            </div>
            <div class="info">
                <span>{{ $user->sent->count() }}</span>
                Messages sent
            </div>
            <div class="info">
                <span>{{ $user->received->count() }}</span>
                Messages received
            </div>
        </div>
    </div>
    <div class="wrapper no-pad">

        <div class="profile-desk">
            <aside class="p-short-info">
                <div class="widget">
                    <div class="title">
                        <h1>About</h1>
                    </div>
                    <p class="mbot20">
                        {{$user->biography}}
                    </p>
                    <div class="bio-row">
                        <p><span>Company Name </span> {{$user->company_name}} </p>
                    </div>
                    <div class="bio-row">
                        <p><span> Address </span> {{$user->address}} </p>
                    </div>
                    <div class="bio-row">
                        <p><span> Telephone </span> {{$user->telephone}} </p>
                    </div>
                    <div class="bio-row">
                        <p><span> Url </span> {{$user->url}} </p>
                    </div>
                    <div class="bio-row">
                        <a href="{{ url('user/edit',$user->id) }}">Edit User</a>
                    </div>

                    <div class="bio-row">
                        <h2> User contacts </h2><span><a href="{{ route('admin.users.editContact', [$user->id]) }}" >edit</a></span>
                        <select class="form-control select2" name="contact_id[]"
                                id="contact_id" multiple="true" disabled

                        >
                            @foreach($usersContacts as $contact)
                                <option value="{{ $contact->id }}" selected >{{ $contact->first_name .' '. $contact->first_name .' '. $contact->email }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="bio-row">
                        <h2> User groups contacts </h2>
                        @foreach($usersGroups as $group)
                            <hr />
                            <h5>Geoup name: {{ $group['group_name'] }}  <span><a href="{{ route('admin.users.editGroup', [$group['group_id']]) }}" >edit</a></span></h5>
                        <p><span>Geoup users</span>
                        <select class="form-control select2 " name="group_id[]"
                                id="group_id" multiple="true" disabled

                        >
                            @foreach($group['group_contacts'] as $contact)
                                <option value="{{ $contact->id }}" selected >{{ $contact->first_name .' '. $contact->first_name .' '. $contact->email }}</option>
                            @endforeach
                        </select>
                        </p>

                        @endforeach
                    </div>

                </div>
            </aside>
        </div>

        @if($user->posts->count())
            <div class="profile-timeline">
                <ul>
                    @foreach($user->posts as $post)
                    <li>
                        <div class="avatar-desk">
                            <a href="#">{{ $user->first_name }}</a> Created post {{ $post->created_at}}
                            <span>{{ $post->title }}</span>
                            <p>{{ $post->description }}</p>
                            <div class="gallery" style="margin-left: 0px;">
                                @foreach($post->images as $image)
                                    <a href="javascript:void(0)"><img width="171" height="107"
                                                     src="/{{ $post->imageDestinationPath() . $image->src }}" alt="">
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    </li>
                    @endforeach
                </ul>
            </div>
        @endif

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

            $('.close').click(function () {
                console.log('arfd');
            });
        });

    </script>
@endsection