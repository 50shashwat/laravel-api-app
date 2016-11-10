<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Api\UserRepository;
use Illuminate\Http\Request;

use App\Http\Requests\UserContactsRequest;

class UserContactsController extends Controller
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
    public function store(UserContactsRequest $request)
    {
        return $this->userRepository->storeUserContacts($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->userRepository->showUserContact($id);
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserContactsRequest $request)
    {
        return $this->userRepository->destroyUserContacts($request);
    }
    
    public function getUserContacts()
    {
        return $this->userRepository->getUserContacts();
    }

    public function accept($id)
    {
        return $this->userRepository->acceptContact($id);
    }
    
    public function invitedList()
    {
        return $this->userRepository->invitedList();
    }

    public function getUsersByPhoneAndContact(Request $request)
    {
        return $this->userRepository->getUsersByPhoneAndContact($request->except('token'));
    }
}
