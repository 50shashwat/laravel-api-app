<div class="header-section">

    <!--logo and logo icon start-->
    <div class="logo dark-logo-bg hidden-xs hidden-sm">
        <a href="{{ route('admin.dashboard') }}">
            <img src="/img/logo-icon.png" alt="">
            <!--<i class="fa fa-maxcdn"></i>-->
            <span class="brand-name">BizIt</span>
        </a>
    </div>

    <div class="icon-logo dark-logo-bg hidden-xs hidden-sm">
        <a href="{{ route('admin.dashboard') }}">
            <img src="/img/logo-icon.png" alt="">
            <!--<i class="fa fa-maxcdn"></i>-->
        </a>
    </div>
    <!--logo and logo icon end-->

    <!--toggle button start-->
    <a class="toggle-btn"><i class="fa fa-outdent"></i></a>
    <!--toggle button end-->

    <div class="notification-wrap">
        <!--right notification start-->
        <div class="right-notification">
            <ul class="notification-menu">
                <li>
                    <form class="search-content" action="{{ route('admin.dashboard') }}" method="post">
                        {!! csrf_field() !!}
                        <input type="text" class="form-control" name="keyword" placeholder="Search...">
                    </form>
                </li>

                <li>
                    <a href="javascript:;" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <img src="{{ $adminUser->getAvatarImage() }}" alt="">{{ $adminUser->name }}
                        <span class=" fa fa-angle-down"></span>
                    </a>
                    <ul class="dropdown-menu dropdown-usermenu purple pull-right">
                        <li><a href="{{ route('admin.profile',$adminUser->id) }}">  Profile</a></li>
                        <li><a href="{{ route('admin.logout') }}"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                    </ul>
                </li>

            </ul>
        </div>
        <!--right notification end-->
    </div>

</div>