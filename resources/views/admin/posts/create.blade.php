@extends('layouts.admin')

@section('styles')
    <link rel="stylesheet" type="text/css" href="{{ elixir('css/profile.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <section class="panel">
                <header class="panel-heading ">Create new post</header>
            </section>
            <div class="panel-body" id="create-post">
                <validator name="postCreateValidation">
                    <form role="form" action="{{ route('admin.posts.create') }}" method="post" enctype="multipart/form-data" novalidate>
                        {{ csrf_field() }}
                        <div class="form-group @if($errors->has('user_id')) has-error @endif">
                            <label for="user_id">Post as user</label>
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

                        <div class="form-group @if($errors->has('access')) has-error @endif">
                            <label for="user_id">Post privacy</label>
                            <select class="form-control select2" name="access"
                                    value="{{ old('access') }}" id="access"
                            >

                                <option value="1">Public</option>
                                <option value="0">Private</option>

                            </select>
                            <span v-if="$postCreateValidation.user_id.required">Privacy required</span>
                            @if($errors->has('access'))
                                <span class="help-block with-errors">{{ $errors->first('access') }}</span>
                            @endif
                        </div>

                        <div class="form-group privacy hidden @if($errors->has('user_contacts')) has-error @endif">
                            <label for="user_id">User contacts</label>
                            <select class="form-control select2" name="user_contacts[]"
                                    value="{{ old('user_contacts') }}" id="user_contacts"
                                    placeholder="SELECT CONTACTS" multiple="true"
                            >


                            </select>
                        </div>

                        <div class="form-group privacy hidden @if($errors->has('user_groups')) has-error @endif">
                            <label for="user_id">User groups</label>
                            <select class="form-control select2" name="user_groups[]"
                                    value="{{ old('user_groups') }}" id="user_groups"
                                    placeholder="SELECT GROUPS" multiple="true"
                            >


                            </select>
                        </div>

                        <div class="form-group @if($errors->has('title')) has-error @endif">
                            <label for="title">Title</label>
                            <input type="text" class="form-control" name="title" value="{{ old('title') }}"
                                   id="title" placeholder="Enter title" v-validate:title="['required']"
                            >
                            <span v-if="$postCreateValidation.title.required">Title required</span>
                            @if($errors->has('title'))
                                <span class="help-block with-errors">{{ $errors->first('title') }}</span>
                            @endif
                        </div>
                        <div class="form-group @if($errors->has('description')) has-error @endif">
                            <label for="description">Description</label>
                            <textarea type="text" class="form-control" name="description"
                                      id="description" placeholder="Enter description"
                                      v-validate:description="['required']"
                            >{{ old('description') }}</textarea>
                            <span v-if="$postCreateValidation.description.required">Description required</span>
                            @if($errors->has('description'))
                                <span class="help-block with-errors">{{ $errors->first('description') }}</span>
                            @endif
                        </div>
                        <div class="form-group @if($errors->has('tags')) has-error @endif">
                            <label for="tags">Tags</label>
                            <input type="text" class="form-control" name="tags" value="{{ old('tags') }}" id="tags"
                                   placeholder="Enter tags (separate with comma, i.e. tag1,tag2,tag3 ...)"
                                   v-validate:tags="['required']"
                            />
                            <span v-if="$postCreateValidation.tags.required">Tags are required</span>
                            @if($errors->has('tags'))
                                <span class="help-block with-errors">{{ $errors->first('tags') }}</span>
                            @endif
                        </div>
                        <div class="form-group @if($errors->has('location')) has-error @endif">
                            <label for="location">Location</label>
                            <input type="text" class="form-control" name="location" value="{{ old('location') }}"
                                   id="location" placeholder="Enter location" v-validate:location="['required']"
                            >
                            <span v-if="$postCreateValidation.location.required">Location required</span>
                            @if($errors->has('location'))
                                <span class="help-block with-errors">{{ $errors->first('location') }}</span>
                            @endif
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group @if($errors->has('user_id')) has-error @endif">
                                    <label for="currency">Select a currency</label>
                                    <select class="form-control select2" name="currency"
                                            value="{{ old('currency') }}" id="currency"
                                            v-validate:currency="['required']"
                                    >
                                        @foreach($currencies as $currency)
                                            <option value="{{ $currency['alpha3'] }}">{{ $currency['name'] }} ({{ $currency['alpha3']}})</option>
                                        @endforeach
                                    </select>
                                    <span v-if="$postCreateValidation.currency.required">Currency required</span>
                                    {{--@if($errors->has('currency'))--}}
                                        <span class="help-block with-errors">{{ $errors->first('currency') }}</span>
                                    {{--@endif--}}
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group @if($errors->has('price')) has-error @endif">
                                    <label for="location">Price</label>
                                    <input type="text" class="form-control" name="price" v-model="currencyInput" value="{{ old('price') }}"
                                           id="price" placeholder="Enter price" v-validate:price="['required']"
                                    >
                                    <span v-if="$postCreateValidation.price.required">Price required</span>
                                    {{--@if($errors->has('price'))--}}
                                    <span class="help-block with-errors">{{ $errors->first('price') }}</span>
                                    {{--@endif--}}
                                </div>
                            </div>
                        </div>
                        <div class="form-group @if($errors->has('expired_at')) has-error @endif">
                            <label for="expired_at">Expired at</label>
                            <input type="date" class="form-control" name="expired_at" value="{{ old('expired_at') }}"
                                   id="expired_at" placeholder="Enter location" v-validate:expired_at="['required']"
                            >
                            <span v-if="$postCreateValidation.expired_at.required">Expired at required</span>
                            @if($errors->has('expired_at'))
                                <span class="help-block with-errors">{{ $errors->first('expired_at') }}</span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label for="image">Images</label>
                            <input id="avatar" class="file" name="image[]"
                                   type="file" multiple=true"
                            >
                        </div>
                        <button type="submit" class="btn btn-info"
                                v-if="$postCreateValidation.valid"
                        >Submit</button>
                    </form>
                </validator>
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
            //        function foo() {
            var user = $('#user_id');
            var userId = $('#user_id').val();
            var user_contacts = $('#user_contacts');
            var user_groups = $('#user_groups');
            var privacy = $('.privacy');
            var access = $('#access');

            user.on('change', function (e) {
                userId = user.val();
                access.val("1").trigger("change");
                privacy.addClass('hidden');
                user_contacts.empty();
                user_groups.empty();
            });

            access.on('change', function (e) {

                if (access.val() == 0)
                {
                    user_contacts.empty();
                    user_groups.empty();

                    $.ajax({
                        url: "getPrivacy/"+userId,
                        success: function(result){
                            $.each(result.contacts, function(index, value) {
                                user_contacts.append(
                                        '<option value="' + result.contacts[index].id + '">' + result.contacts[index].text + '</option>'
                                );
                            });

                            user_contacts.select2();
                            $.each(result.groups, function(index, value) {
                                user_groups.append(
                                        '<option value="' + result.groups[index].id + '">' + result.groups[index].text + '</option>'
                                );
                            });
                            user_groups.select2();
                        }
                    });

                    privacy.removeClass('hidden');
                } else {
                    user_contacts.empty();
                    user_groups.empty();
                    privacy.addClass('hidden');
                }
            });

//        }

        });





    </script>
@endsection