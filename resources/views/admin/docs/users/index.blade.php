@extends('layouts.docs')

@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-create" aria-expanded="false">
                        Create User
                    </a>
                </h4>
            </div>
            <div id="users-create" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.users._register')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-login" aria-expanded="false">
                        User's login
                    </a>
                </h4>
            </div>
            <div id="users-login" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._login')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-update" aria-expanded="false">
                        User's update
                    </a>
                </h4>
            </div>
            <div id="users-update" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._update')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-posts" aria-expanded="false">
                        User's listings
                    </a>
                </h4>
            </div>
            <div id="users-posts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._postsOrFavourites')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-get-contacts" aria-expanded="false">
                        Get user's contacts
                    </a>
                </h4>
            </div>
            <div id="users-get-contacts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getContacts')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-get-contact" aria-expanded="false">
                        Get user's contact
                    </a>
                </h4>
            </div>
            <div id="users-get-contact" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getContact')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-add-contacts" aria-expanded="false">
                        Add to user's contacts
                    </a>
                </h4>
            </div>
            <div id="users-add-contacts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._addContacts')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-accept-contacts" aria-expanded="false">
                        Accept user's contacts
                    </a>
                </h4>
            </div>
            <div id="users-accept-contacts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._acceptContacts')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-destroy-contacts" aria-expanded="false">
                        Delete from user's contacts
                    </a>
                </h4>
            </div>
            <div id="users-destroy-contacts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._destroyContacts')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-invite-contacts" aria-expanded="false">
                        invitation list
                    </a>
                </h4>
            </div>
            <div id="users-invite-contacts" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._inviteContacts')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-getGroups" aria-expanded="false">
                        Get user's groups
                    </a>
                </h4>
            </div>
            <div id="users-getGroups" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getGroups')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-getGroup" aria-expanded="false">
                        Get user's group
                    </a>
                </h4>
            </div>
            <div id="users-getGroup" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getGroup')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-createGroup" aria-expanded="false">
                        Create user's group
                    </a>
                </h4>
            </div>
            <div id="users-createGroup" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._createGroup')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-editGroup" aria-expanded="false">
                        Edit user's group
                    </a>
                </h4>
            </div>
            <div id="users-editGroup" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._editGroup')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-destroyGroup" aria-expanded="false">
                        Delete user's group
                    </a>
                </h4>
            </div>
            <div id="users-destroyGroup" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._destroyGroups')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-getGroupUsers" aria-expanded="false">
                        Get group user's
                    </a>
                </h4>
            </div>
            <div id="users-getGroupUsers" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getGroupUsers')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-storeGroupUsers" aria-expanded="false">
                        Add users to a group
                    </a>
                </h4>
            </div>
            <div id="users-storeGroupUsers" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._storeGroupUsers')
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-destroyGroupUsers" aria-expanded="false">
                        Delete users from a group
                    </a>
                </h4>
            </div>
            <div id="users-destroyGroupUsers" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._destroyGroupUsers')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#users-searchUsers" aria-expanded="false">
                        Search User by email,first name and last name
                    </a>
                </h4>
            </div>
            <div id="users-searchUsers" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._searchUser')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#change-users-avatar" aria-expanded="false">
                        Change User Avatar
                    </a>
                </h4>
            </div>
            <div id="change-users-avatar" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._changeAvatar')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#getPhoneContact" aria-expanded="false">
                        Get users bay phone number and email
                    </a>
                </h4>
            </div>
            <div id="getPhoneContact" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._getUsersByPhoneAndContact')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#checkUserEmail" aria-expanded="false">
                        Check user email exist
                    </a>
                </h4>
            </div>
            <div id="checkUserEmail" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._CheckUserEmail')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#checkPostLimit" href="#checkPostLimit" aria-expanded="false">
                        Check Post Limit
                    </a>
                </h4>
            </div>
            <div id="checkPostLimit" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._checkPostLimit')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#userMeta" href="#userMeta" aria-expanded="false">
                        User Meta
                    </a>
                </h4>
            </div>
            <div id="userMeta" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._userMeta')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#userInfo" href="#userInfo" aria-expanded="false">
                        User info
                    </a>
                </h4>
            </div>
            <div id="userInfo" class="panel-collapse collapse" aria-expanded="false">
                <div class="panel-body">
                    @include('admin.docs.users._userInfo')
                </div>
            </div>
        </div>
    </div>
@endsection