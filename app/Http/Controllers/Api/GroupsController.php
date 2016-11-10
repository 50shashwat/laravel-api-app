<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Api\UserRepository;
use Illuminate\Http\Request;

use App\Http\Requests\GroupsRequest;

class GroupsController extends Controller
{

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * UserContactsController constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GroupsRequest $request)
    {
        return $this->userRepository->storeGroups($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->userRepository->showGroup($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(GroupsRequest $request, $id)
    {
        return $this->userRepository->updateGroups($request,$id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(GroupsRequest $request)
    {
        return $this->userRepository->destroyGroups($request);
    }

    public function getGroups()
    {
        return $this->userRepository->getAllGroups();
    }
}
