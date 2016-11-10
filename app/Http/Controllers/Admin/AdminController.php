<?php

namespace App\Http\Controllers\Admin;

use App\Admin;
use App\Groups;
use App\Helpers\CurrencyHelper;
use App\Http\Requests\AdminCreateContact;
use App\Http\Requests\AdminCreateGroup;
use App\Http\Requests\AdminCreateMessage;
use App\Http\Requests\AdminCreatePost;
use App\Http\Requests\AdminCreateUser;
use App\Http\Requests\AdminUpdateRequest;
use App\Post;
use App\Repositories\Admin\AdminRepository;
use App\User;
use App\UserContact;
use App\UserGroups;
use Illuminate\Http\Request;
use Auth;
use Carbon\Carbon;

class AdminController extends AdminBaseController
{
    /**
     * @var AdminRepository
     */
    protected $adminRepository;

    /**
     * AdminController constructor.
     * @param AdminRepository $adminRepository
     */
    public function __construct(AdminRepository $adminRepository)
    {
        parent::__construct();
        $this->adminRepository = $adminRepository;
    }
    /**
     * Retrieve information for rendering dashboard's index page
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDashboard()
    {
        return view('admin.dashboard.index',$this->adminRepository->getAllDataForDashboard());
    }

    /**
     * Retrieve and render admin's profile page
     *
     * @param Admin $admin
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @internal param $id
     */
    public function getProfile(Admin $admin)
    {
        return view('admin.dashboard.profile',compact('admin'));
    }

    /**
     * Update the admin's profile data by given ID
     *
     * @param AdminUpdateRequest $request
     * @param Admin $admin
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateProfile(AdminUpdateRequest $request, Admin $admin)
    {
        return $this->adminRepository->updateAdmin($admin,$request->all());
    }

    /**
     * Get all users registrated through API
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getAllUsers()
    {
        return view('admin.users.index',$this->adminRepository->getAllUsers());
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postLogin(Request $request)
    {
        if(Auth::guard('admin')->attempt($request->only('email','password')))
        {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->back();
    }

    /**
     * Get all information about user
     *
     * @param User $user
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getUserInfo(User $user)
    {
        $user->load(['posts.images','sent','received', 'groups']);

        $usersContacts = UserContact::leftJoin('users','users.id', '=', 'user_contacts.contact_id')
                                        ->where('user_contacts.user_id', $user->id)
                                        ->select('users.*')
                                        ->get();
      
        $usersGroups = [];
        foreach ($user->groups as $group)
        {
            $usersGroups[] = [
                'group_id'       => $group->id,
                'group_name'     => $group->name,
                'group_contacts' => $group->contacts,
            ];
        }

        return view('admin.users.info',compact('user','usersContacts', 'usersGroups'));
    }


    public function getInfoEditUser($id){
        $user = User::where('id',$id)->firstOrFail();
        $dt = new \DateTime($user['expired_at']);
        $carbon = Carbon::instance($dt)->format('d-m-Y');
        $user['y_m_d_expired_at'] =  str_replace('-', '/', $carbon);
        return view('admin.users.edit',['user'=>$user]);
    }

    /**
     * Show the create new user view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreateNewUser()
    {
        return view('admin.users.create');
    }

    /**
     * Create new user
     *
     * @param AdminCreateUser $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createNewUser(AdminCreateUser $request)
    {
        return $request->persist();
    }

    public function editUser(AdminUpdateRequest $request){
        return $this->adminRepository->editUser($request->all());
    }

    /**
     * Show the create new post view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreateNewPost()
    {
        $users = User::all();
        $currencies = CurrencyHelper::getAll();

        return view('admin.posts.create',compact('users', 'currencies'));
    }

    public function getCreateContact()
    {
        $users = User::all();
        return view('admin.users.createContact',compact('users'));
    }
    
    public function getEditContact($id)
    {
        $user = User::where('id', $id)->get();

        $userContacts = UserContact::leftJoin('users','users.id', '=', 'user_contacts.contact_id')
                                     ->where('user_contacts.user_id', $id)
                                     ->select('users.*', 'user_contacts.contact_token', 'user_contacts.contact_email')
                                     ->get();

        $users = User::whereNotIn('id', $userContacts->pluck('id'))->get();
      
        return view('admin.users.editContact',compact('user', 'userContacts', 'users'));
    }
    
    public function updateContact(AdminCreateContact $request)
    {
        return $request->persist();
    }

    public function createCreateContact(AdminCreateContact $request)
    {
        return $request->persist();
    }

    public function getCreateGroup()
    {
        $users = User::all();
        return view('admin.users.createGroup',compact('users'));
    }

    public function createCreateGroup(AdminCreateGroup $request)
    {
        return $request->persist();
    }

    public function ajaxGetUsers($id)
    {
        if(is_numeric($id)){
            return User::where('id','<>',$id)->select('id','first_name','last_name')->get();
        }
        return redirect()->back();
    }

    public function ajaxGetPosts($id){
        if(is_numeric($id)){
            return Post::join('users','users.id','=','posts.user_id')
                ->where('users.id',$id)
                ->select('posts.id','posts.title')
                ->get();
        }
        return redirect()->back();
    }

    public function ajaxGetContact($id)
    {
        if(is_numeric($id)){
            return UserContact::Join('users','user_contacts.contact_id','=','users.id')
                ->where('user_id',$id)
                ->select('user_contacts.contact_id','users.last_name','users.first_name')
                ->get();
        }
        return redirect()->back();
    }

    public function getEditGroup($id)
    {
        $group = Groups::where('id', $id)->get();
        
        $user  = User::where('id', $group[0]->user_id)->get();

        $groupUsers = UserGroups::leftJoin('users','users.id', '=', 'user_groups.user_id')
                                    ->where('user_groups.group_id', $group[0]->id)
                                    ->select('users.*')
                                    ->get();
        $groupUsersid = [];
        foreach ($groupUsers as $value)
        {
            $groupUsersid[] = $value->id;
        }
        $users = User::whereNotIn('id',$groupUsersid)->get();
        return view('admin.users.editGroup',compact('user', 'group', 'groupUsers', 'users'));
    }
    
    public function editUpdateGroup(AdminCreateGroup $request)
    {
        return $request->updateGroup();
    }

    public function getUserGroupAndContacts($userId)
    {
        $userContacts = UserContact::leftJoin('users','users.id', '=', 'user_contacts.contact_id')
                                     ->where('user_contacts.user_id', $userId)
                                     ->select(['user_contacts.id', 'users.first_name', 'users.last_name',])
                                     ->get();

        $userGroups = Groups::where('user_id', $userId)->get();

        $contacts = [];
        foreach ($userContacts as $contact)
        {
            $contacts[] = [
                    'id'   => $contact->id,
                    'text' => $contact->first_name .' '. $contact->last_name,
                ];
        }

        $groups = [];
        foreach ($userGroups as $group)
        {
            $groups[] = [
                'id'   => $group->id,
                'text' => $group->name,
            ];
        }

        return [
                'contacts' => $contacts,
                'groups'   => $groups
               ];

    }
    
    public function getPosts()
    {
        $posts = Post::with(['user','images'])->get();

        return view('admin.posts.index');
    }

    public function getAllPosts()
    {
        $posts = Post::with(['user','images'])->withTrashed()->get();

        $posts->map(function($post)
        {
            $post->thumbImg = ($post->images->count() != 0)
                ? $post->imageDestinationPath() . $post->images[0]->src
                : '/img/404.png';
            $post->userAvatar = $post->user->getAvatarImage();
        });

        return response()->json($posts);

    }

    public function enablePost($postId)
    {
        $post = Post::withTrashed()->find($postId);

        $post->restore();

        return response()->json(['success' => true]);
    }

    public function disablePost(Post $post)
    {
        $post->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Create new post
     *
     * @param AdminCreatePost $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createNewPost(AdminCreatePost $request)
    {
        return $request->persist();
    }

    /**
     * Show the create new message view
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreateNewMessage()
    {
        $users = User::all();
        $posts = Post::all();

        return view('admin.messages.create',compact('users','posts'));
    }

    /**
     * Create new message
     *
     * @param AdminCreateMessage $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createNewMessage(AdminCreateMessage $request)
    {
        return $request->persist();
    }
}
