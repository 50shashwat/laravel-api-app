<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;

class ApiDocsController extends AdminBaseController
{
    /**
     * Get docs for users api endpoint
     * 
     * @return mixed
     */
    public function getUsers()
    {
        return view('admin.docs.users.index');
    }

    /**
     * Get docs for posts api endpoint
     * 
     * @return mixed
     */
    public function getPosts()
    {
        return view('admin.docs.posts.index');
    }

    /**
     * Get docs for messages api endpoint
     * 
     * @return mixed
     */
    public function getMessages()
    {
        return view('admin.docs.messages.index');
    }

    /**
     * Get docs for listings api endpoint
     * 
     * @return mixed
     */
    public function getListings()
    {
        return view('admin.docs.listings.index');
    }

    /**
     * Get docs for favourites api endpoint
     * 
     * @return mixed
     */
    public function getFavourites()
    {
        return view('admin.docs.favourites.index');
    }

    /**
     * Get docs for favourites api endpoint
     *
     * @return mixed
     */
    public function getMisc()
    {
        return view('admin.docs.misc.index');
    }

//    public function getPayment(){
//        return view('admin.docs.payment.index');
//    }
}
