<?php

Route::get('/', function () {
    return view('home');
});
Route::get('/braintree',function(){
    return view('admin.braintree.index');
});

//Route::get('test',function (){
//   return view('test',['pay_token'=> \Braintree\ClientToken::generate()]);
//});

Route::post('braintree/webhook','WebhooksController@handleWebhook');

Route::get('register',function (){
    return view('register');
});
Route::resource('payment','Api\PaymentController');

Route::get('countries',['as' => 'countries','uses' => 'CountriesController@getAllCountries']);
Route::get('states/{country}',['as' => 'states','uses' => 'CountriesController@getStatesForCountry']);
Route::get('cities/{state}',['as' => 'states','uses' => 'CountriesController@getCitiesForStates']);
Route::get('currencies', ['as' => 'currencies','uses' => 'CurrencyController@getAll']);

Route::group(['middleware' => 'web'], function () {
    Route::get('invitation','Auth\AuthController@invitation');
    Route::get('login',function()
    {
        return view('auth.login');
    });
    Route::auth();
    Route::post('register',['as' => 'register','uses' => 'Auth\AuthController@register']);
    Route::get('activate/{code}',['as' => 'activate', 'uses' => 'Api\ApiController@activate']);
    Route::get('test-message','Api\MessagesController@sendMessage');
    Route::group(['prefix' => 'admin','as' => 'admin.'], function()
    {
        Route::post('login',['as' => 'login','uses' => 'Admin\AdminController@postLogin']);
        Route::get('logout',['as' => 'logout','uses' => 'Auth\AuthController@getLogout']);
    });

    Route::group(['middleware' => 'auth:admin','as' => 'admin.','namespace' => 'Admin'], function()
    {
        Route::get('dashboard',['as' => 'dashboard','uses' => 'AdminController@getDashboard']);
        Route::get('profile/{admin}',['as' => 'profile', 'uses' => 'AdminController@getProfile']);
        Route::put('profile/{admin}',['as' => 'profile', 'uses' => 'AdminController@updateProfile']);

        Route::group(['as' => 'users.'],function()
        {
            Route::get('users',['as' => 'index','uses' => 'AdminController@getAllUsers']);
            Route::get('users/{user}',['as' => 'info', 'uses' => 'AdminController@getUserInfo']);
            Route::get('user/add',['as' => 'create', 'uses' => 'AdminController@getCreateNewUser']);
            Route::get('user/edit/{id}',['as' => 'edit', 'uses' => 'AdminController@getInfoEditUser']);
            Route::post('user/add',['as' => 'create', 'uses' => 'AdminController@createNewUser']);
            Route::post('user/edit/',['as' => 'edit', 'uses' => 'AdminController@editUser']);
            Route::get('user/addContact',['as' => 'createContact', 'uses' => 'AdminController@getCreateContact']);
            Route::post('user/addContact',['as' => 'createContact', 'uses' => 'AdminController@createCreateContact']);
            Route::get('user/editContact/{id}',['as' => 'editContact', 'uses' => 'AdminController@getEditContact']);
            Route::put('user/updateContact',['as' => 'updateContact', 'uses' => 'AdminController@updateContact']);

            Route::get('user/addGroup',['as' => 'createGroup', 'uses' => 'AdminController@getCreateGroup']);
            Route::post('user/addGroup',['as' => 'createGroup', 'uses' => 'AdminController@createCreateGroup']);

            Route::get('user/getContactAjax/{id}',['as' => 'getContactsAjax', 'uses' => 'AdminController@ajaxGetContact']);
            Route::get('user/getUsersAjax/{id}',['as' => 'getUsersAjax', 'uses' => 'AdminController@ajaxGetUsers']);
            Route::get('user/getPostsAjax/{id}',['as' => 'getPostsAjax', 'uses' => 'AdminController@ajaxGetPosts']);
            Route::get('user/editGroup/{id}',['as' => 'editGroup', 'uses' => 'AdminController@getEditGroup']);
            Route::put('user/updateGroup',['as' => 'updateGroup', 'uses' => 'AdminController@editUpdateGroup']);
            
        });

        Route::group(['prefix' => 'posts','as' => 'posts.'], function()
        {
            Route::get('',['as' => 'all','uses' => 'AdminController@getPosts']);
            Route::get('fetch',['as' => 'fetch','uses' => 'AdminController@getAllPosts']);
            Route::post('enable/{postId}',['as' => 'enable', 'uses' => 'AdminController@enablePost']);
            Route::post('disable/{post}',['as' => 'disable', 'uses' => 'AdminController@disablePost']);
            Route::get('create', ['as' => 'create','uses' => 'AdminController@getCreateNewPost']);
            Route::post('create', ['as' => 'create','uses' => 'AdminController@createNewPost']);
            Route::get('getPrivacy/{userId}', ['as' => 'getPrivacy','uses' => 'AdminController@getUserGroupAndContacts']);

            Route::get('userContacts/{id}', ['as' => 'getContacts','uses' => 'AdminController@getUserContactsById']);
        });

        Route::group(['prefix' => 'messages','as' => 'messages.'], function()
        {
            Route::get('create', ['as' => 'create','uses' => 'AdminController@getCreateNewMessage']);
            Route::post('create', ['as' => 'create','uses' => 'AdminController@createNewMessage']);
        });


        Route::post('dashboard',['as' => 'dashboard','uses' =>function()
        {
            return 'Search is not working at the moment';
        }]);

        Route::group(['prefix' => 'api/docs','as' => 'docs.'], function()
        {
            Route::get('users',['as' => 'users', 'uses' => 'ApiDocsController@getUsers']);
            Route::get('posts',['as' => 'posts', 'uses' => 'ApiDocsController@getPosts']);
            Route::get('messages',['as' => 'messages', 'uses' => 'ApiDocsController@getMessages']);
            Route::get('listings',['as' => 'listings','uses' => 'ApiDocsController@getListings']);
            Route::get('favourites',['as' => 'favourites','uses' => 'ApiDocsController@getFavourites']);
            Route::get('misc',['as' => 'misc','uses' => 'ApiDocsController@getMisc']);
//            Route::get('payment',['as' => 'payment','uses' => 'ApiDocsController@getPayment']);
        });

        Route::group(['prefix' => 'activities','as' => 'activities.'], function()
        {
            Route::get('logins', ['as' => 'logins', 'uses' => 'ActivitiesController@getLoginsActivity']);
            Route::get('registrations', ['as' => 'registrations', 'uses' => 'ActivitiesController@getRegistrationsActivity']);
            Route::get('posts', ['as' => 'posts', 'uses' => 'ActivitiesController@getPostsActivity']);
            Route::get('messages', ['as' => 'messages', 'uses' => 'ActivitiesController@getMessagesActivity']);
        });

        Route::group(['prefix' => 'graphs', 'as' => 'graphs.'], function()
        {
            Route::group(['prefix' => 'users', 'as' => 'users.'], function()
            {
                Route::get('logins',['as' => 'logins','uses' => 'GraphController@getLogins']);
                Route::post('logins',['as' => 'logins','uses' => 'GraphController@retrieveLogins']);
                Route::post('registrations',['as' => 'registrations','uses' => 'GraphController@retrieveRegistrations']);
            });
        });

    });


});

Route::group(['prefix' => 'api/v1','as' => 'api.','namespace' => 'Api'],function()
{

    Route::get('countries',['as' => 'countries','uses' => 'CountriesController@getAllCountries']);

    Route::post('login',['as' => 'login','uses' => 'ApiController@postLogin']);
    Route::post('register',['as' => 'register','uses' => 'ApiController@postRegister']);
    Route::post('checkEmail',['as' => 'checkEmail','uses' => 'ApiController@checkEmail']);
    Route::get('currencies', ['as' => 'currencies','uses' => 'CurrencyController@getAll']);
    Route::get('users',['middleware' => ['jwt.auth'],'uses' => 'ApiController@getUser']);
    
    /*
     * Route::get('reset/email',['as' => 'email.reset', 'uses' => '@resetEmail']);
     *
     * Class not fount
     *
     * */    
    Route::resource('verifyReceipt','PaymentController', ['only' => ['store']]);
    Route::get('posts',['as' => 'posts.all','uses' => 'PostsController@getAll']);
    
    Route::group(['prefix' => 'search'],function()
    {
        Route::get('posts',['as' => 'search.posts', 'uses' => 'SearchController@getPosts']);
    });


    Route::group(['middleware' => ['jwt.auth']],function()
    {
        Route::put('user',['as' => 'users.update','uses' => 'ApiController@updateUser']);

        Route::group(['prefix' => 'posts','as' => 'posts.'], function()
        {
            Route::get('{postId}',['as' => 'show','uses' => 'PostsController@showPosts'])->where('postId', '[0-9]+|me');
            Route::post('create',['as' => 'create', 'uses' => 'PostsController@createEditPost']);
            Route::post('reposts/{post}',['as' => 'reposts', 'uses' => 'PostsController@createRePosts']);
//            Route::put('{postId}', ['as' => 'update', 'uses' => 'PostsController@updatePost']);
            Route::delete('{postId}',['as' => 'destroy','uses' => 'PostsController@destroy']);
            Route::post('{postId}/message/send',['as' => 'message.send', 'uses' => 'PostsController@sendMessage']);
            Route::post('{postId}/reply/{userId}',['as' => 'message.reply','uses' => 'PostsController@replyToMessage']);

            Route::resource('notification','NotificationController');
            Route::post('notification/see','NotificationController@seeNot');
        });



        Route::group(['prefix' => 'users','as' => 'users.'], function()
        {

//            Route::group(['as'=>'premium'],function (){
//                Route::resource('userTag','TagSubscribeController');
//            });
            Route::post('makePremium','PaymentController@makePremium');

            Route::group(['prefix' => 'favourites','as' => 'favourites.'], function(){
//                Route::get('createOrDelete/{id}',['as' => 'createOrDelete','uses' => 'ApiController@createOrDeleteFavourites']);
                Route::get('/{id}',['as' => 'add','uses' => 'ApiController@addToFavourites']);
                Route::get('',['as' => 'all','uses' => 'ApiController@getFavourites']);

                Route::delete('',['as' => 'remove','uses' => 'ApiController@removeFromFavourites']);
                Route::post('check',['as' => 'check','uses' => 'ApiController@checkFavourites']);
            });


            Route::group(['prefix' => 'contacts', 'as' => 'contacts.'], function (){
                Route::get('accept/{id}',['as' => 'accept','uses' => 'UserContactsController@accept']);
                Route::get('',['as' => 'all','uses' => 'UserContactsController@getUserContacts']);
                Route::get('{id}',['as' => 'show','uses' => 'UserContactsController@show']);
                /*
                 * Route::post('storeByEmail',['as' => 'storeByEmail','uses' => 'UserContactsController@storeByEmail']);
                 *
                 * function not fount
                 * */

                Route::post('',['as' => 'store','uses' => 'UserContactsController@store']);

                Route::delete('',['as' => 'destroy','uses' => 'UserContactsController@destroy']);
            });

            Route::group(['prefix' => 'groups', 'as' => 'groups.'], function (){
                Route::get('',['as' => 'all','uses' => 'GroupsController@getGroups']);
                Route::get('{id}',['as' => 'show','uses' => 'GroupsController@show']);
                Route::post('',['as' => 'store','uses' => 'GroupsController@store']);
                Route::put('{id}',['as' => 'update','uses' => 'GroupsController@update']);
                Route::delete('',['as' => 'destroy','uses' => 'GroupsController@destroy']);
            });
            
            Route::group(['prefix' => 'groupusers', 'as' => 'groups.'], function (){
                Route::get('{id}',['as' => 'all','uses' => 'UserGroupsController@getGroupUsers']);
                Route::post('{id}',['as' => 'store','uses' => 'UserGroupsController@store']);
                Route::delete('{id}',['as' => 'destroy','uses' => 'UserGroupsController@destroy']);
            });

            Route::get('invite',['as' => 'invite','uses' => 'UserContactsController@invitedList']);
            Route::get('post/limit',['as' => 'post.limit','uses' => 'PostsController@checkLimit']);
            Route::post('changeAvatar',['as'=>'changeAvatar','uses'=>'ApiController@changeAvatar']);
            
//            Route::get('posts',['as' => 'posts', 'uses' => 'ApiController@getUserPosts']);
            Route::get('posts',['as' => 'posts', 'uses' => 'ApiController@getUserPostsOrFavourites']);
            Route::get('meta',['as' => 'meta', 'uses' => 'ApiController@getMetaData']);
            /*
            *  Route::get('alerts',['as' => 'alerts', 'uses' => 'ApiController@getAlerts']);
            *  Route::post('alerts',['as' => 'alerts','uses' => 'ApiController@setAlerts']);
            *  Route::put('alerts',['as' => 'alerts','uses' => 'ApiController@changeAlerts']);
            *  Route::delete('alerts',['as' => 'alerts','uses' => 'ApiController@deleteAlert']);
            *
            *  functions not fount
            * */

            Route::get('{id}',['as' => 'user','uses' => 'ApiController@getUserInfo'])->where('id', '[0-9]+');
            Route::post('byQuickbloxIds',['as' => 'byQuickbloxIds', 'uses' => 'ApiController@getUserInfoByQuickbloxId']);
            Route::get('conversations',['as' => 'conversations.all','uses' => 'ChatController@index']);
            Route::get('conversationsOpen/{userId}/{postId}',['as' => 'conversation.user','uses' => 'ChatController@openConversation']);
            Route::get('conversationsClose/{userId}/{postId}',['as' => 'conversation.user','uses' => 'ChatController@closeConversation']);
            Route::get('{search}',['uses' => 'ApiController@getUsersSearch']);

            Route::post('getUsersByPhoneAndContact',['uses' => 'UserContactsController@getUsersByPhoneAndContact']);
        });
    });
});