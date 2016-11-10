<?php

namespace App\Http\Controllers\Admin;

use App\Repositories\Admin\ActivitiesRepository;

class ActivitiesController extends AdminBaseController
{
    /**
     * @var ActivitiesRepository
     */
    protected $repository;

    /**
     * ActivitiesController constructor.
     * @param ActivitiesRepository $repository
     */
    public function __construct(ActivitiesRepository $repository)
    {
        parent::__construct();
        $this->repository = $repository;
    }

    /**
     * Get all activities type of logins
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getLoginsActivity()
    {
        return view('admin.activity.logins.index',$this->repository->getLoginsActivity());
    }

    /**
     * Get all activities type of registrations
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getRegistrationsActivity()
    {
        return view('admin.activity.registrations.index',$this->repository->getRegistrationsActivity());
    }

    /**
     * Get all activities type of post
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getPostsActivity()
    {
        return view('admin.activity.posts.index',$this->repository->getPostsActivity());
    }

    /**
     * Get all activities type of message
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getMessagesActivity()
    {
        return view('admin.activity.messages.index',$this->repository->getMessagesActivity());
    }
}
