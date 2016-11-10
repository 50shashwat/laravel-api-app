<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Repositories\Admin\AdminRepository;
use Auth;

class AdminBaseController extends Controller
{
    /**
     * AdminController constructor.
     */
    public function __construct()
    {
        view()->share('adminUser',Auth::guard('admin')->user());
    }
}
