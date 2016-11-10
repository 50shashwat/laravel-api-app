<?php

namespace App\Repositories\Api;

use App\Events\EmailNotifier;
use App\Groups;
use App\Http\Requests\Request;
use App\Http\Responses\ApiResponse;
use App\Services\Transformers\GroupsTransFormer;
use App\Services\Transformers\PostTransFormer;
use App\Services\Transformers\UserContactsTransFormer;
use App\Services\Transformers\UserGroupsTransFormer;
use App\Services\Transformers\UserInviteContactsTransFormer;
use App\Services\Transformers\Users\ChatHistoryTransformer;
use App\Services\Transformers\UserConversationsTransformer;
use App\Services\Transformers\UserMetaTransformer;
use App\Services\Transformers\Users\UserFavouritesTransformer;
use App\Services\Transformers\UserTransformer;
use App\Services\Transformers\UserDataTransformer;
use App\Services\Transformers\ConversationTransFormer;
use App\User;
use App\UserContact;
use App\UserGroups;
use App\UserMessage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException as JWTAbsentException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Services\Activity;
use App\Transaction;
use App\Post;
use App\Helpers\Quickblox;
use App\QuickbloxUserData;
use App\Conversation;
use Carbon\Carbon;

/**
 * Class UserRepository
 * @package App\Repositories\Api
 */
class UserRepository extends BaseRepository
{
    /**
     * @var ApiResponse
     */
    private $response;

    /**
     * @var UserTransformer
     */
    private $userTransformer;

    /**
     * @var UserMetaTransformer
     */
    private $userMetaTransformer;

    /**
     * @var UserFavouritesTransformer
     */
    private $userFavouritesTransformer;

    /**
     * @var PostTransFormer
     */
    private $postTransformer;

    /**
     * @var UserConversationsTransformer
     */
    private $userConversationsTransformer;

    /**
     * @var ChatHistoryTransformer
     */
    private $userChatHistoryTransformer;

    /**
     * @var GroupsTransFormer
     */
    private $groupsTransFormer;

    /**
     * @var UserContactsTransFormer
     */
    private $userContactsTransFormer;

    /**
     * @var UserGroupsTransFormer
     */
    private $userGroupsTransFormer;

    /**
     * @var UserInviteContactsTransFormer
     */
    private $userInviteContactsTransFormer;

    /** @var UserDataTransformer ...*/
    private $userDataTransformer;

    private $userId;

    private $paymentRepository;

    private $postsRepository;

    private $conversationTransFormer;

    private $conversation;

    /**
     * UserRepository constructor.
     * @param ApiResponse $response
     * @param UserTransformer $userTransformer
     * @param UserMetaTransformer $userMetaTransformer
     * @param PostTransFormer $postTransFormer
     * @param UserFavouritesTransformer $userFavouritesTransformer
     * @param UserConversationsTransformer $userConversationsTransformer
     * @param ChatHistoryTransformer $userChatHistoryTransformer
     * @param GroupsTransFormer $groupsTransFormer
     * @param UserContactsTransFormer $userContactsTransFormer
     * @param UserGroupsTransFormer $userGroupsTransFormer
     * @param UserInviteContactsTransFormer $userInviteContactsTransFormer
     */
    public function __construct(ApiResponse $response,
                                UserTransformer $userTransformer,
                                UserMetaTransformer $userMetaTransformer,
                                PostTransFormer $postTransFormer,
                                UserFavouritesTransformer $userFavouritesTransformer,
                                UserConversationsTransformer $userConversationsTransformer,
                                ChatHistoryTransformer $userChatHistoryTransformer,
                                GroupsTransFormer $groupsTransFormer,
                                UserContactsTransFormer $userContactsTransFormer,
                                UserGroupsTransFormer $userGroupsTransFormer,
                                UserInviteContactsTransFormer $userInviteContactsTransFormer,
                                PaymentRepository $paymentRepository,
                                PostsRepository $postsRepository,
                                Conversation $conversation,
                                ConversationTransFormer $conversationTransFormer,
                                UserDataTransformer $userDataTransformer)
    {
        $this->userTransformer = $userTransformer;
        $this->userMetaTransformer = $userMetaTransformer;
        $this->response = $response;
        $this->userFavouritesTransformer = $userFavouritesTransformer;
        $this->postTransformer = $postTransFormer;
        $this->userConversationsTransformer = $userConversationsTransformer;
        $this->userChatHistoryTransformer = $userChatHistoryTransformer;
        $this->groupsTransFormer = $groupsTransFormer;
        $this->userContactsTransFormer = $userContactsTransFormer;
        $this->userGroupsTransFormer = $userGroupsTransFormer;
        $this->userInviteContactsTransFormer = $userInviteContactsTransFormer;
        $this->userDataTransformer = $userDataTransformer;
        $this->paymentRepository = $paymentRepository;
        $this->postsRepository = $postsRepository;
        $this->conversation = $conversation;
        $this->conversationTransFormer = $conversationTransFormer;

        if (JWTAuth::getToken()) {
            $this->userId = JWTAuth::parseToken()->authenticate()->id;
        }
    }

    /**
     * @param $credentials
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginUserByCredentials($credentials)
    {
        $deviceToken = array_pull($credentials, 'device_token');

        try {
            if (! $token = JWTAuth::attempt($credentials->only('email', 'password'))) {
                return $this->response->error('invalid_credentials', 401);
            }
        } catch (JWTException $e) {
            
            return $this->response->error('could_not_create_token', 500);
        }

        Activity::UserSignInLog(JWTAuth::setToken($token)->authenticate());

        $user = $this->findUserByEmailAddress($credentials['email']);

        if ($deviceToken) {
            $this->updateDeviceToken($user, $deviceToken);
        }

        $user['token'] = $token;
        $user['QuickBloxPassword'] = $user->quickblox['password'];
        $user['quickblox_id'] = $user->quickblox['quickblox_id'];

        return $this->response->show($user, $this->userDataTransformer);
    }


    /**
     * Create new user data record in database
     *
     * @param $arrUserData
     * @return \Illuminate\Http\JsonResponse
     */
    public function createNewUser($arrUserData)
    {
        $objAvatar = array_pull($arrUserData, 'avatar');
        $deviceToken = array_pull($arrUserData, 'device_token');
        
        $objUser = User::create($arrUserData);
        if(isset($objUser->id)){
            $quick = Quickblox::registerUser([
                'email' => $arrUserData['email'],
                'login' => $arrUserData['email'],
                'password' => $arrUserData['password']
            ]);
            if(is_array($quick)){

                return $this->response->error('Oops something went wrong', $quick['error']['code']);
            }
            try{
                QuickbloxUserData::create([
                    'quickblox_id'=>$quick->id,
                    'owner_id'=>$quick->owner_id,
                    'user_id'=>$objUser->id,
                    'password'=>$quick->password
                ]);
            }catch (\Exception $e){
                
                return $this->response->error();
            }
        }

        if (is_object($objAvatar)) {
            if ($objAvatar != null) {
                $this->moveFileToDestination($objAvatar, $objUser);
            }
        }
        if ($objUser->type == User::TYPE_PREMIUM) {
            $transaction = Transaction::where('transaction_id',$arrUserData['transaction_id'])->first();
            if($transaction){
                $transaction->update(['user_id'=>$objUser->id]);
                $objUser->update(['expired_at'=>$transaction->expires_date]);
            }else{
                $objUser->type = User::TYPE_REGULAR;
                $objUser->save();
//                return $this->response->error('You are not registered as a premium user as you didn`t pass the Apple payment process');
            }


            $this->paymentRepository->sendConfirmationEmail($objUser);
        }
        $this->sendConfirmationEmail($objUser);


        Activity::UserSignUpLog($objUser);

        $credentials = ['email' => $objUser->email, 'password' => $arrUserData['password']];
        $token = JWTAuth::attempt($credentials);
        if ($deviceToken) {
            $this->updateDeviceToken($objUser, $deviceToken);
        }
        $objUser->token = $token;
        $objUser['quickblox_id'] = $quick->id;
        $objUser['QuickBloxPassword'] = $quick->password;
        
        return $this->response->show($objUser, $this->userDataTransformer);
    }

    public function updateAvatar($request)
    {
        $user = User::where('id', $request['id'])->first();
        $objAvatar = $request['avatar'];
        if ($user) {
            if ($user->avatar !=  '') {
                \File::delete($user->avatar);
            }

            if (is_object($objAvatar)) {
                $this->moveFileToDestination($objAvatar, $user);
                
                return $this->response->show($user, $this->userDataTransformer);
            }
        }

        return $this->response->error('Please enter a valid avatar and id user');
    }


    /**
     * @param $code
     * @return array
     */
    public function activateAccountByCode($code)
    {
        $objUser = User::whereCode($code)->first();

        $activated = false;

        if (is_object($objUser) && $objUser->exists) {
            $objUser->update([
                'code'   => '',
                'active' => 1
            ]);
            $activated = true;
        }

        return compact('activated');
    }

    /**
     * Return user metadata information
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserMetaData()
    {
        $user = $this->fetchLoggedInUser();
        $user->load(['sent', 'received', 'posts']);

        return $this->response->show($user, $this->userMetaTransformer);
    }

    /**
     * @param $arrData
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser($arrData)
    {
//        $notEmpty = [
//            'email' =>0,
//            'last_name'=>1,
//            'first_name'=>2
//        ];

        foreach ($arrData as $key => $value) {
//            if ($value == "" && isset($notEmpty[$key])) {
            if ($value == "") {
                unset($arrData[$key]);
//                return $this->response->error('This field may be unchecked but not blank. '.$key);
            }
        }
        $objUser = $this->fetchLoggedInUser();
//        if (isset($arrData['expired_at']) && $objUser->type == User::TYPE_PREMIUM) {
//            $dt = new \DateTime($arrData['expired_at']);
//            $carbon = Carbon::instance($dt);
//            $arrData['expired_at'] = $carbon->toDateTimeString();
//        } else {
//            $dt = new \DateTime('0 day');
//            $carbon = Carbon::instance($dt);
//            $arrUserData['expired_at'] = $carbon->toDateTimeString();
//        }


        if (isset($arrData['old_password']) && $arrData['password'] != '') {
            $objUser->update([
                'password' => array_pull($arrData, 'password'),
            ]);
        }

        if (isset($arrData['avatar'])) {
            \File::deleteDirectory($objUser->imageDestinationPath());
            $this->moveFileToDestination(array_pull($arrData, 'avatar'), $objUser);
        }

        if (!isset($arrData['device_token']) || !$arrData['device_token']) {
            $arrData['device_token'] = $objUser->device_token;
        }

        $objUser->update($arrData);
        $objUser->token = request('token');

        return $this->response->show($objUser, $this->userDataTransformer);
    }

    /**
     * Resend email for activation email
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendResetEmail()
    {
        $user = $this->fetchLoggedInUser();
        if (! $user->active) {
            if ($this->sendConfirmationEmail($user)) {
                
                return response()->json(['success' => 'Activation email sent']);
            }
        }
        event(new EmailNotifier('passwordReminder'));
        
        return response()->json(['error' => 'Your account is already activated']);
    }

    /**
     * Get all favourite products for user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFavourites()
    {
        $user = $this->fetchLoggedInUser();

        return $this->response->show($user, $this->userFavouritesTransformer);
    }

    /**
     * Add a product to user's favourites list
     *
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToFavourites($postId)
    {
        $user = $this->fetchLoggedInUser();

        $objFavourite = $user->load(['favourites' => function ($query) use ($postId) {
            $query->wherePostId($postId);
        }])->favourites;


        if (is_object($objFavourite) && $objFavourite->count() != 0) {
            
            return $this->response->favouriteProductAlreadyAdded();
        }

        $user->favourites()->create([
            'post_id' => $postId,
        ]);

        return $this->response->show($user, $this->userFavouritesTransformer);
    }

    public function checkFavourites($postId)
    {
        $user = Auth::user();

        if (!Post::where('id', $postId)->first()) {
            
            return $this->response->error('Please enter a valid post id');
        }

        $favourites = $user->favourites()->where('post_id', $postId)->first();
        if ($favourites) {
            
            return $this->response->checkFavourites();
        }
        
        return $this->response->error('This post is not a Favourites');
    }

    public function createOrDeleteFavourites($postId)
    {
        $user = $this->fetchLoggedInUser();

        if (!Post::where('id', $postId)->first()) {
            
            return $this->response->error('Please enter a valid post id');
        }

        if ($user->favourites()->where('post_id', $postId)->first()) {
            $user->favourites()->where('post_id', $postId)->delete();

            return $this->response->error('Successfully removed from favorite', 403);
        }
        if ($user->favourites()->create(['post_id' => $postId])) {
            
            return $this->response->success('Successfully added to favorite');
        }
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInfo($id)
    {
        $user = User::where('id',$id)->first();
        if($user){
            $user->load(['posts' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }]);

            return $this->response->show($user, $this->userTransformer);
        }

        return $this->response->error('Please enter a valid user id');
    }

    public function getQuickbloxUserInfo($ids)
    {

        $users = User::join('quickblox_user_datas', function ($join) use($ids){
            $join->on('users.id','=','quickblox_user_datas.user_id')
                ->whereIn('quickblox_user_datas.quickblox_id',$ids);
        })
            ->groupBy('users.id')
            ->select('users.*')
            ->get();

        return $this->response->collection($users, $this->userTransformer);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPosts()
    {
        $user = $this->fetchLoggedInUser();

        $user->load(['posts' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return $this->response->collection($user->posts, $this->postTransformer);
    }

    /**
     * Generate new image file name for avatar
     * Move file to destination folder
     *
     * @param $objAvatar
     * @param $objUser
     * @return string
     */
    private function moveFileToDestination($objAvatar, $objUser)
    {
        $extension = $objAvatar->getClientOriginalExtension();

        $fileName = $objUser->generateAvatarName() . $extension;
        $destinationPath = $objUser->imageDestinationPath();

        $objAvatar->move($destinationPath, $fileName);

        $objUser->update([
            'avatar' => $fileName
        ]);

        return true;
    }

    /**
     * @param object $user
     * @return string $activationCode
     */
    private function sendConfirmationEmail($user)
    {
        $activationCode = str_random(60);

        $msgData = [
            'user' => $user,
            'code' => $activationCode,
        ];

        Mail::send('auth.emails.activation', $msgData, function ($msg) use ($user) {
            $msg->from('support@pallitapp.com', '"Pallitapp Support');

            $msg->to($user->email, $user->fullName())->subject('Activation email');
        });

        $user->update([
            'code'   => $activationCode,
            'active' => 0
        ]);

        return true;
    }

    /**
     * Get all conversations that user is in
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserConversations()
    {
        $user = $this->getAuthenticatedUser();
        $conversation = $this->conversation->where('member_1_id',$user->id)
                                            ->orWhere('member_2_id',$user->id)
                                            ->get();

        return $this->response->collection($conversation, $this->conversationTransFormer);
    }

    /**
     * Get logged in user conversation with the given user
     *
     * @param $receiverId
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserConversationWithUser($receiverId, $postId)
    {
        $user = $this->getAuthenticatedUser();

        return $this->getHistory($user->id, $receiverId, $postId);
    }

    public function openConversationWithUserAndPost($receiverId, $postId){
        $user = $this->getAuthenticatedUser();
        if($this->getConversationWithUserAndPost($receiverId, $postId,$user)){
            
            return $this->response->error('Conversation is already open');
        }
        try{
            $this->conversation->create(['member_1_id'=>$user->id,'member_2_id'=>$receiverId,'post_id'=>$postId]);
        }catch (\Exception $e){

            return $this->response->error('Please enter valid data');
        }

        return $this->response->success('You have successfully started the conversation. ');
    }

    public function closeConversationWithUserAndPost($receiverId, $postId){
        $conversation = $this->getConversationWithUserAndPost($receiverId, $postId,$this->getAuthenticatedUser());
        if($conversation){
            $conversation->updated_at = Carbon::now();
            $conversation->save();

            return $this->response->success('You have successfully finished the conversation.');
        }

        return $this->response->error('No conversation');
    }

    public function getConversationWithUserAndPost($receiverId, $postId,$user)
    {
        return  $this->conversation
                    ->orWhere(function ($query) use ($user,$receiverId,$postId){

                        return $query->where('member_1_id',$user->id)
                            ->where('member_2_id',$receiverId)
                            ->where('post_id',$postId);

                    })->orWhere(function ($query)use ($user,$receiverId,$postId){

                        return $query->where('member_2_id',$user->id)
                            ->where('member_1_id',$receiverId)
                            ->where('post_id',$postId);

                    })->first();
    }

    public function searchUser($data)
    {
        $searchResult = User::where('email', 'Like', '%'.$data.'%')
            ->orWhere('last_name', 'Like', '%'.$data.'%')
            ->orWhere('first_name', 'Like', '%'.$data.'%')
            ->get();

        return $this->response->collection($searchResult, $this->userTransformer);
    }

    /**
     * Return logged in user if token is provided
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthenticatedUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                
                return response()->json(['user_not_found'], 404);
            }
        } catch (TokenExpiredException $e) {
            
            return response()->json(['token_expired'], $e->getStatusCode());
            
        } catch (TokenInvalidException $e) {
            
            return response()->json(['token_invalid'], $e->getStatusCode());
            
        } catch (JWTAbsentException $e) {
            
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return $user;
    }

    /**
     * If authentication was successful
     * then we can find user by email
     *
     * @param $email
     * @return mixed
     */
    private function findUserByEmailAddress($email)
    {
        return User::whereEmail($email)->first();
    }

    /**
     * @param $user
     * @param $deviceToken
     */
    private function updateDeviceToken($user, $deviceToken)
    {
        $user->update([
            'device_token' => $deviceToken
        ]);
    }

    /**
     * Get the history of conversations for logged in user
     *
     * @param $senderId
     * @param $receiverId
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    private function getHistory($senderId, $receiverId, $postId)
    {
        $objMessageSends = UserMessage::where('post_id', $postId)
            ->where('sender_id', $senderId)
            ->where('receiver_id', $receiverId)
            ->get();

        $objMessageReceivers = UserMessage::where('post_id', $postId)
            ->where('sender_id', $receiverId)
            ->where('receiver_id', $senderId)
            ->get();

        if($objMessageSends->isEmpty() && $objMessageReceivers->isEmpty()){
            
            return $this->response->error('Please enter valid data');
        }

        $arrMessages = [];
        foreach ($objMessageSends as $objMessageSend) {
            array_push($arrMessages, $objMessageSend);
        }

        foreach ($objMessageReceivers as $objMessageReceiver) {
            array_push($arrMessages, $objMessageReceiver);
        }

        $collection = new Collection($arrMessages);

        $sortedCollection = $collection->sortBy('created_at');

        return $this->response->show($sortedCollection, $this->userChatHistoryTransformer);
    }


    public function getUserContacts()
    {
        $contacts = UserContact::orWhere('user_contacts.user_id', $this->userId)
            ->orWhere(function ($query) {
                $query->where('user_contacts.contact_id', $this->userId)
                    ->where('status', 'accepted');
            })->get();

        return $this->response->collection($contacts, $this->userContactsTransFormer);
    }

    public function destroyUserContacts($request)
    {
        if (UserContact::orWhere(function ($query) use ($request) {
            $query->whereIn('contact_id', $request->input('contacts'))->where('user_id', $this->userId);
        })->orWhere(function ($query) use ($request) {
            $query->whereIn('user_id', $request->input('contacts'))->where('contact_id', $this->userId);
        })->delete()
        ) {
            return $this->response->contactsDestroy();
        }

        return $this->response->error('Please enter a valid contact id');
    }

    public function storeUserContacts($request)
    {
        $contactsIds = $request->input('contacts');

        $contacts = [];

        foreach ($contactsIds as $contact) {
            $token = null;
            $email = null;

            if (!is_numeric($contact)) {
                if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
                    $registToEmail = UserContact::where('contact_email', $contact)->where('user_id', $this->userId)->first();
                    if (!$registToEmail) {
                        $user = User::where('email', $contact)->first();
                        $email = $contact;
                        if (!$user) {
                            $token = md5(time() . $email);
                            $contact = null;
                            Mail::send('emails.welcome', ['token' => $token, 'email' => $email], function ($m) use ($email) {
                                $m->from('support@pallit-test.ml', 'Pallit');
                                $m->to($email, $email)->subject('Invitation');
                            });
                        } else {
                            $contact = $user->id;
                        }
                    } else {
                        $token = $registToEmail->contact_token;
                        $email = $registToEmail->contact_email;
                        $contact = null;
                    }
                }
            }

            if ($email && !$contact) {
                UserContact::where('user_id', $this->userId)->where('contact_email', $email)->delete();
            } else {
                $email = null;
            }

            if (UserContact::where('contact_id', $this->userId)
                ->where('user_id', $contact)
                ->update(['status' => 'accepted'])
            ) {
                $cont = UserContact::where('contact_id', $this->userId)->where('user_id', $contact)->first();
            } elseif ($this->userId == $contact) {
                
                return ['error' => 'You want to add yourself to friend'];
                
            } else {
                $cont = UserContact::firstOrCreate([
                    'user_id'    => $this->userId,
                    'contact_id' => $contact,
                    'contact_email' => $email,
                    'contact_token' => $token,
                    'status'     => 'pending'
                ]);
            }

            if (!is_null($contact)) {
                $contacts[] = $cont;
            }
        }

        return $this->response->collection($contacts, $this->userContactsTransFormer);
    }

    public function invitedList()
    {
        $inviteUsers = UserContact::where([['contact_id', '=', $this->userId], ['status', '=', 'pending']])
            ->get();
        
        return $this->response->collection($inviteUsers, $this->userInviteContactsTransFormer);
    }

    public function getUsersByPhoneAndContact($data)
    {
        $model = User::all();
        $users = [];
        $result = [];

        foreach ($model as $key =>  $user) {
            $users['email'][$user['email']] = $user;
            $users['telephone'][$user['telephone']] = $user;
        }

        foreach ($data['data'] as $value) {
            if (isset($value['email']) && isset($users['email'][$value['email']])) {
                $result[] = $users['email'][$value['email']];
            } elseif (isset($value['phone']) && isset($users['telephone'][$value['phone']])) {
                $result[] = $users['telephone'][$value['phone']];
            }
        }

        return $this->response->collection($result, $this->userTransformer);
    }

    public function acceptContact($id)
    {
        if (
        UserContact::where([['contact_id', '=', $this->userId], ['user_id', '=', $id]])
            ->update(['status' => 'accepted'])
        ) {
            
            return $this->response->acceptContact();
        }

        return $this->response->error('Please enter a valid user id');
    }

    public function showUserContact($id)
    {
        $contact = UserContact::orWhere(function ($query) use ($id) {
            $query->where('user_id', $this->userId)
                ->where('contact_id', $id);
        })->orWhere(function ($query) use ($id) {
            $query->where('contact_id', $this->userId)
                ->where('user_id', $id)
                ->where('status', 'accepted');
        })->get();

        return $this->response->collection($contact, $this->userContactsTransFormer);
    }

    public function getAllGroups()
    {
        $groups = Groups::where('user_id', $this->userId)
            ->get();
        
        return $this->response->collection($groups, $this->groupsTransFormer);
    }

    public function showGroup($id)
    {
        try {
            $group = Groups::where('user_id', $this->userId)
                ->findOrFail($id);

            $group->get();
            if ($group) {
                
                return $this->response->show($group, $this->groupsTransFormer);
            }
        } catch (ModelNotFoundException $e) {
            
            return $this->response->error('Please enter a valid group id');
        }
    }

    public function storeGroups($request)
    {
        if (Groups::where('user_id', $this->userId)->count() < 10) {
            $group = Groups::create([ 'user_id' => $this->userId, 'name' => $request->input('name')]);
            
            return $this->response->show($group, $this->groupsTransFormer);
        }
        
        return $this->response->groupsCreationLimitExceeded();
    }

    public function updateGroups($request, $id)
    {
        $group = Groups::where('user_id', $this->userId)
            ->findOrFail($id);

        $group->update(['name' => $request->input('name') ]);

        return $this->response->show($group, $this->groupsTransFormer);
    }

    public function destroyGroups($request)
    {
        if (Groups::destroy($request->input('groups'))) {
            return $this->response->groupsDestroy();
        }

        return $this->response->error('Please enter a valid groups id');
    }

    public function getGroupUsers($id)
    {
        $groupUsers = UserGroups::leftJoin('groups', 'groups.id', '=', 'user_groups.group_id')
            ->where('groups.user_id', $this->userId)
            ->where('group_id', $id)
            ->select('user_groups.*')
            ->get();
        
        return $this->response->collection($groupUsers, $this->userGroupsTransFormer);
    }

    public function storeGroupUsers($request, $id)
    {
        $groupUsers = [];

        foreach ($request->input('userIds') as $userId) {
            $userContact = UserContact::orWhere(function ($query) use ($userId) {
                $query->where('user_id', $this->userId)
                    ->where('contact_id', $userId);
            })->orWhere(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('contact_id', $this->userId)
                    ->where('status', 'accepted');
            })->get();

            if (isset($userContact[0])) {
                $groupUsers[] = UserGroups::firstOrCreate(['group_id' => $id, 'user_id' => $userId]);
            }
        }
        
        return $this->response->collection($groupUsers, $this->userGroupsTransFormer);
    }

    public function destroyGroupUsers($request, $id)
    {
        if (UserGroups::where('group_id', $id)->whereIn('user_id', $request->input('userIds'))->delete()) {
            
            return $this->response->groupsUsersDestroy();
        }

        return $this->response->error('Please enter a valid user id');
    }

    public function checkEmail($request)
    {
        if ($request['email']) {
            if (filter_var($request['email'], FILTER_VALIDATE_EMAIL)) {
                
                return $this->response->checkFree(User::where('email', $request['email'])->first());
            }
            
            return $this->response->error('Please enter a valid email address');
        }
        
        return $this->response->error('Please enter a email');
    }

    public function timeoutUser($id)
    {
        $user = User::where('id', $id)->first();
        $posts = $user->posts()->orderBy('created_at', 'desc')->get();
        $regular = $user->getRegular();
        foreach ($posts as $key => $value) {
            $value->access = 1;
            if ($key < $regular['post']) {
                $this->inActive($value, $regular, true);
                $value->save();
                continue;
            }
            $value->active = 0;

            $this->inActive($value, $regular);
            $value->save();
        }

        $user->update(['type'=>0]);

        return 'You are now downgraded to Regular plan';
    }

    public function inActive($post, $regular, $all = false)
    {
        $post->tags()->update(['active'=>0]);
        $post->images()->update(['active'=>0]);
        if ($all) {
            $post->tags()->orderBy('created_at', 'desc')->limit($regular['tag'])->update(['active'=>1]);
            $post->images()->orderBy('created_at', 'desc')->limit($regular['image'])->update(['active'=>1]);
        }

        return true;
    }
}
