var elixir = require('laravel-elixir');

require('laravel-elixir-vueify');

var publicCss = 'public/css/';
var publicJs  = 'public/js/';
var resourceJs = 'resources/assets/js/';

elixir(function(mix) {
    mix.styles([
        'bootstrap.min.css',
        'jquery-ui-1.10.3.css',
        'bootstrap-reset.css',
        'font-awesome.css',
        'icomoon-weather.css',
        'default-theme.css',
        'simple-line-icons.css',
        'style.css',
        'style-responsive.css'
    ],publicCss + 'main-style.css');

    mix.styles([
        'jquery.easy-pie-chart.css',
        'jquery-jvectormap-1.1.1.css',
        'slidebars.css',
        'switchery.min.css',
        'jquery-ui-1.10.1.custom.min.css',
        'all.css',
        'owl.carousel.css',
        '../../../' + publicCss + 'main-style.css'
    ],publicCss + 'app.css');

    mix.styles([
        'bootstrap-fileinput-master/fileinput.min.css',
        'sweetalert.css',
        // 'select2.css',
        'select2.min.css',
        'select2-bootstrap.css',

    ],publicCss + 'profile.css');

    mix.styles([
        'data-table/css/jquery.dataTables.css',
        'data-table/css/dataTables.tableTools.css',
        'data-table/css/dataTables.colVis.min.css',
        'data-table/css/dataTables.responsive.css',
        'data-table/css/dataTables.scroller.css'
    ],publicCss + 'dataTable.css');

    mix.scripts([
        'html5shiv.js',
        'respond.min.js'
    ],publicJs + 'ie.js');

    mix.scripts([
        'jquery-1.11.1.min.js',
        'bootstrap.min.js'
    ],publicJs + 'login.js');

    mix.scripts([
        'jquery-1.10.2.min.js',
        'jquery-ui/jquery-ui-1.10.1.custom.min.js',
        'jquery-migrate.js',
        'bootstrap.min.js',
        'modernizr.min.js',
        'jquery.nicescroll.js',
        'slidebars.min.js',
        'switchery/switchery.min.js',
        'switchery/switchery-init.js',
        'flot-chart/jquery.flot.js',
        'flot-chart/flot-spline.js',
        'flot-chart/jquery.flot.resize.js',
        'flot-chart/jquery.flot.tooltip.min.js',
        'flot-chart/jquery.flot.pie.js',
        'flot-chart/jquery.flot.selection.js',
        'flot-chart/jquery.flot.stack.js',
        'flot-chart/jquery.flot.crosshair.js',
        'earning-chart-init.js',
        'sparkline/jquery.sparkline.js',
        'sparkline/sparkline-init.js',
        'jquery-easy-pie-chart/jquery.easy-pie-chart.js',
        'easy-pie-chart.js',
        'vector-map/jquery-jvectormap-1.2.2.min.js',
        'vector-map/jquery-jvectormap-world-mill-en.js',
        'dashboard-vmap-init.js',
        'icheck/skins/icheck.min.js',
        'todo-init.js',
        'jquery-countTo/jquery.countTo.js',
        'owl.carousel.js',
        'scripts.js',
        'custom.js'

    ],publicJs + 'app.js');

    mix.browserify('admin-post-create.js',resourceJs + 'adminCreatePost.js');
    mix.scripts([
        'bootstrap-fileinput-master/js/fileinput.js',
        'file-input-init.js',
        'sweetalert.min.js',
        'adminCreatePost.js',
        'select2.full.min.js'
        // 'select2.js',
        // 'select2-init.js'
    ],publicJs + 'profile.js');

    mix.scripts([
        'data-table/js/jquery.dataTables.min.js',
        'data-table/js/dataTables.tableTools.min.js',
        'data-table/js/bootstrap-dataTable.js',
        'data-table/js/dataTables.colVis.min.js',
        'data-table/js/dataTables.responsive.min.js',
        'data-table/js/dataTables.scroller.min.js',
        'data-table-init.js'
    ],publicJs + 'dataTable.js');

    mix.browserify('activity-notify.js');

    mix.scripts([
        'notify.min.js',
        'pusher.js',
        '../../../' + publicJs + 'activity-notify.js'
    ],publicJs + 'activities.js');

    mix.browserify('graphs/graphs.js');

    mix.browserify('posts.js');

    mix.version([
        publicCss + 'main-style.css',
        publicCss + 'app.css',
        publicCss + 'profile.css',
        publicCss + 'dataTable.css',
        publicJs  + 'ie.js',
        publicJs  + 'login.js',
        publicJs  + 'app.js',
        publicJs  + 'profile.js',
        publicJs  + 'dataTable.js',
        publicJs  + 'activities.js',
        publicJs  + 'graphs.js',
        publicJs  + 'posts.js'
    ]);
});
