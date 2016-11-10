<div class="sidebar-left">
    <!--responsive view logo start-->
    <div class="logo dark-logo-bg visible-xs-* visible-sm-*">
        <a href="index.html">
            <img src="/img/logo-icon.png" alt="">
            <!--<i class="fa fa-maxcdn"></i>-->
            <span class="brand-name">BizIt</span>
        </a>
    </div>
    <!--responsive view logo end-->

    <div class="sidebar-left-info">
        <!-- visible small devices start-->
        <div class=" search-field">  </div>
        <!-- visible small devices end-->

        <!--sidebar nav start-->
        <ul class="nav nav-pills nav-stacked side-navigation">
            <li>
                <h3 class="navigation-title">Navigation</h3>
            </li>
            <li @if(request()->is('dashboard')) class="active" @endif><a href="{{ route('admin.dashboard') }}"><i class="fa fa-home"></i> <span>Dashboard</span></a></li>
            <li class="menu-list {{ request()->is('user*') ? 'active' : '' }}">
                <a href=""><i class="fa fa-users"></i><span>Users</span></a>
                <ul class="child-list">
                    <li @if(request()->is('users')) class="active" @endif><a href="{{ route('admin.users.index') }}">All users</a></li>
                    <li @if(request()->is('user/add')) class="active" @endif><a href="{{ route('admin.users.create') }}">Create user</a></li>
                    <li @if(request()->is('user/addContact')) class="active" @endif><a href="{{ route('admin.users.createContact') }}">Create contact</a></li>
                    <li @if(request()->is('user/addGroup')) class="active" @endif><a href="{{ route('admin.users.createGroup') }}">Create group</a></li>
                </ul>
            </li>
            <li class="menu-list {{ request()->is('posts*') ? 'active' : '' }}">
                <a href=""><i class="fa fa-book"></i><span>Posts</span></a>
                <ul class="child-list">
                    <li @if(request()->is('posts/all')) class="active" @endif><a href="{{ route('admin.posts.all') }}">All posts</a></li>
                    <li @if(request()->is('posts/create')) class="active" @endif><a href="{{ route('admin.posts.create') }}">Create post</a></li>
                </ul>
            </li>
            <li class="menu-list {{ request()->is('messages*') ? 'active' : '' }}">
                <a href=""><i class="fa fa-file-text"></i><span>Messages</span></a>
                <ul class="child-list">
                    <li @if(request()->is('messages/create')) class="active" @endif><a href="{{ route('admin.messages.create') }}">Create message</a></li>
                </ul>
            </li>
            <li class="menu-list {{ request()->is('activities*') ? 'active' : '' }}">
                <a href=""><i class="fa fa-area-chart"></i><span>Activities</span></a>
                <ul class="child-list">
                    <li @if(request()->is('activities/logins')) class="active" @endif><a href="{{ route('admin.activities.logins') }}">Login</a></li>
                    <li @if(request()->is('activities/registrations')) class="active" @endif><a href="{{ route('admin.activities.registrations') }}">Registration</a></li>
                    <li @if(request()->is('activities/posts')) class="active" @endif><a href="{{ route('admin.activities.posts') }}">Post</a></li>
                    <li @if(request()->is('activities/messages')) class="active" @endif><a href="{{ route('admin.activities.messages') }}">Message</a></li>
                </ul>
            </li>
            <li class="menu-list @if(request()->is('api/docs*')) active @endif">
                <a href=""><i class="fa fa-tasks"></i>  <span>Docs</span></a>
                <ul class="child-list">
                    <li @if(request()->is('api/docs/users')) class="active"  @endif>
                        <a href="{{ route('admin.docs.users') }}">Users</a>
                    </li>
                    <li @if(request()->is('api/docs/posts')) class="active"  @endif>
                        <a href="{{ route('admin.docs.posts') }}">Posts</a>
                    </li>
                    <li @if(request()->is('api/docs/messages')) class="active"  @endif>
                        <a href="{{ route('admin.docs.messages') }}">Messages</a>
                    </li>
                    <li @if(request()->is('api/docs/listings')) class="active"  @endif>
                        <a href="{{ route('admin.docs.listings') }}">Listings</a>
                    </li>
                    <li @if(request()->is('api/docs/favourites')) class="active"  @endif>
                        <a href="{{ route('admin.docs.favourites') }}">Favourites</a>
                    </li>
                    <li @if(request()->is('api/docs/misc')) class="active"  @endif>
                        <a href="{{ route('admin.docs.misc') }}">Misc.</a>
                    </li>
                    {{--<li @if(request()->is('api/docs/payment')) class="active"  @endif>--}}
                        {{--<a href="{{ route('admin.docs.payment') }}">Payment.</a>--}}
                    {{--</li>--}}
                </ul>
            </li>
            <li class="menu-list {{ request()->is('graphs*') ? 'active' : '' }}">
                <a href=""><i class="fa icon-bar-chart"></i>  <span>Graphs</span></a>
                <ul class="child-list">
                    <li @if(request()->is('graphs/users/logins')) class="active" @endif><a href="{{ route('admin.graphs.users.logins') }}">Users</a></li>
                </ul>
            </li>

        </ul>
        <!--sidebar nav end-->



    </div>
</div>