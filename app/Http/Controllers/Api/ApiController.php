<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\UserRegisterRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Repositories\Api\UserRepository;
use Illuminate\Http\Request;
use JWTAuth;
use App\Helpers\Quickblox;

class ApiController extends Controller
{
    /**
     * @var UserRepository
     */
    private $apiUserRepository;

    /**
     * ApiController constructor.
     * @param UserRepository $apiUserRepository
     */
    public function __construct(UserRepository $apiUserRepository)
    {
        $this->apiUserRepository = $apiUserRepository;
    }

    /**
     * Login user with given credentials
     *
     * @param UserLoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postLogin(UserLoginRequest $request)
    {
        return $this->apiUserRepository->loginUserByCredentials($request);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser()
    {
        return $this->apiUserRepository->getAuthenticatedUser();
    }

    /**
     * Create new user by given data
     *
     * @param UserRegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postRegister(UserRegisterRequest $request)
    {
        return $this->apiUserRepository->createNewUser($request->only(
            'first_name',
            'last_name',
            'email',
            'password',
            'avatar',
            'type',
            'transaction_id',
            'purchase_date',
            'product_id',
            'country',
            'company_name',
            'biography'
        ));
    }

    /**
     * Resend activation email of user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetEmail()
    {
        return $this->apiUserRepository->sendResetEmail();
    }

    /**
     * Update user data with given id and data
     *
     * @param UserUpdateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(UserUpdateRequest $request)
    {
        return $this->apiUserRepository->updateUser($request->only('company_name','biography','password','old_password','avatar'));
    }

    /**
     * Get metadata of user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMetaData()
    {
        return $this->apiUserRepository->getUserMetaData();
    }

    /**
     * Get user's favourite posts
     * 
     * @return mixed
     */
    public function getFavourites()
    {
        return $this->apiUserRepository->getFavourites();
    }

    public function getUserPostsOrFavourites(Request $request)
    {
        if ($request->input('type') == 0) {
            
            return $this->getUserPosts();
            
        } elseif ($request->input('type') == 1) {
            
            return $this->getFavourites();
        }
        
        return [
            'code'    => 404,
            'success'  => false,
            'error'=>'Please enter a valid type'

        ];
    }

    /**
     * Add post to user favourites list
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
//    public function addToFavourites(Request $request)
//    {
//        return $this->apiUserRepository->addToFavourites($request->post_id);
//    }

    public function checkFavourites(Request $request)
    {
        return $this->apiUserRepository->checkFavourites($request->only('post_id'));
    }
    
    public function addToFavourites($id)
    {
        return $this->apiUserRepository->createOrDeleteFavourites($id);
    }

    /**
     * Get all posts for the user
     */
    public function getUserPosts()
    {
        return $this->apiUserRepository->getUserPosts();
    }

    /**
     * Activate user's account by given code
     *
     * @param $code
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function activate($code)
    {
        return view('users.active', $this->apiUserRepository->activateAccountByCode($code));
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInfo($id)
    {
        return $this->apiUserRepository->getUserInfo($id);
    }

    /**
     *
     */
    public function getConversations()
    {
        return $this->apiUserRepository->getUserConversations();
    }

    /**
     * Get conversation between logged in user and given user about given post
     *
     * @param $userId
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserConversation($userId, $postId)
    {
        return $this->apiUserRepository->getUserConversationWithUser($userId, $postId);
    }

    public function getUsersSearch(Request $request)
    {
        return $this->apiUserRepository->searchUser($request->q);
    }

    public function changeAvatar(Request $request)
    {
        return $this->apiUserRepository->updateAvatar($request);
    }
    
    public function checkEmail(Request $request)
    {
        return $this->apiUserRepository->checkEmail($request);
    }
    public function getUserInfoByQuickbloxId(Request $request)
    {
        return $this->apiUserRepository->getQuickbloxUserInfo($request->ids);
    }
}
