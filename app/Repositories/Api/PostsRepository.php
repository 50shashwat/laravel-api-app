<?php

namespace App\Repositories\Api;

use App\Http\Responses\ApiResponse;
use App\Message;
use App\Post;
use App\PostImage;
use App\PostPrivacy;
use App\PostTag;
use App\Services\Transformers\PostTransFormer;
use App\Services\Transformers\UserMessageTransformer;
use App\Services\Transformers\NotificationTransFormer;
use App\Tag;
use App\User;
use App\UserMessage;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use JWTAuth;
use App\Services\Activity;
use App\Notification;
use App\TagSubscribe;
use \Auth;
use \Storage;
use Carbon\Carbon;

class PostsRepository extends BaseRepository
{
    /**
     * @var Post
     */
    private $post;

    /**
     * @var PostTag
     */
    private $postTag;

    /**
     * @var PostTransFormer
     */
    private $postTransFormer;

    private $natificationTransFormer;
    /**
     * @var ApiResponse
     */
    private $response;

    /**
     * @var UserMessageTransformer
     */
    private $userMessageTransformer;

    /**
     * @var
     */
    private $client;

    private $userId;
    
    private $tagSubscribe;

    private $tag;

    /**
     * PostsRepository constructor.
     * @param Post $post
     * @param PostTag $postTag
     * @param PostTransFormer $postTransFormer
     * @param ApiResponse $response
     * @param UserMessageTransformer $userMessageTransformer
     * @param Client $client
     */
    public function __construct(Post $post,
                                PostTag $postTag,
                                PostTransFormer $postTransFormer,
                                ApiResponse $response,
                                UserMessageTransformer $userMessageTransformer,
                                Client $client,
                                NotificationTransFormer $natificationTransFormer,
                                TagSubscribe $tagSubscribe,
                                Tag $tag
    ) {
        $this->post = $post;
        $this->postTag = $postTag;
        $this->postTransFormer = $postTransFormer;
        $this->response = $response;
        $this->userMessageTransformer = $userMessageTransformer;
        $this->client = $client;
        $this->natificationTransFormer  = $natificationTransFormer;
        $this->tagSubscribe = $tagSubscribe;
        $this->tag = $tag;

        if (JWTAuth::getToken()) {
            $this->userId = JWTAuth::parseToken()->authenticate()->id;
        }
    }

    /**
     * Retrieve all posts
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllPosts()
    {
        $posts = Post::getPosts()->get();
        
        return $this->response->collection($posts, $this->postTransFormer);
    }

    public function showPosts($postId)
    {
        $posts = Post::where('user_id', $this->userId);

        if ($postId == 'me') {
            $posts = $posts->orderBy('created_at', 'desc')->get();

            return $this->response->collection($posts, $this->postTransFormer);
            
        } else {
            try {
                $posts = $posts->findOrFail($postId);

                if ($posts) {
                    
                    return $this->response->show($posts, $this->postTransFormer);
                }
            } catch (ModelNotFoundException $e) {
                
                return $this->response->error('Please enter a valid post id');
            }
        }
    }

    /**
     * @param $data
     * @return \Illuminate\Http\JsonResponse
     */
    public function CreateOrUpdateNewPostForUser($data)
    {
        $dt = new \DateTime($data['expired_at']);
        $carbon = Carbon::instance($dt);
        $data['expired_at'] = $carbon->toDateTimeString();

        if (!isset($data['id']) || (isset($data['id']) and $data['id'] == 0)) {
            
            return $this->createNewPostForUser($data);
        }

        return $this->updatePost($data, $data['id']);
    }

    public function createNewPostForUser($data)
    {
        $user = Auth::user();
        $objUser = $this->fetchLoggedInUser();
        $arrTags = explode(',', array_pull($data, 'tags'));
        $arrImages = array_pull($data, 'image');
        $privacy = array_pull($data, 'privacy');
        $access  = $data['access'];
        
        if ($access != Post::TYPE_PRIVATE && $access != Post::TYPE_PUBLIC) {
            
            return $this->response->error('Access only 1, 0');
        }
        
        $access = $access == Post::TYPE_PRIVATE ? $access = 'private' : $access = 'public';

        $valid = $this->checkPermition([
            'tag'=>count($arrTags),
            'post'=>$user->posts->count(),
            'image'=>count($arrImages),
            $access=> '',
        ]);

        if ($valid) {
            
            return $valid;
        }

        $objPost = $objUser->posts()->create($data);

        if ($privacy && !$data['access']) {
            $PostPrivacy = [];
            $date = date('Y-m-d h:m:s');

            if ($privacy['contact']) {
                foreach ($privacy['contact'] as $value) {
                    $PostPrivacy[] = [
                        'post_id'    => $objPost->id,
                        'access_id'  => $value,
                        'type'       => 'contact',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            if ($privacy['group']) {
                foreach ($privacy['group'] as $value) {
                    $PostPrivacy[] = [
                        'post_id'    => $objPost->id,
                        'access_id'  => $value,
                        'type'       => 'group',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            PostPrivacy::insert($PostPrivacy);
        }

        $this->moveFilesToDestinationFolder($objPost, $arrImages);
        
        if (count($arrTags)) {
            $this->updateTagsForPost($arrTags, $objPost, $objUser);
        }
        
        $objPost->load(['tags.tag', 'images']);
        Activity::UserCreatedPostLog($objPost, $objUser);

        return $this->response->show($objPost, $this->postTransFormer);
    }

    /**
     * Update post data
     *
     * @param $data
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePost($data, $postId)
    {
        $objUser = $this->fetchLoggedInUser();

        $arrTags = (isset($data['tags'])) ? explode(',', array_pull($data, 'tags')) : [];
        $arrImages = (isset($data['image'])) ? array_pull($data, 'image') : [];
        $privacy = array_pull($data, 'privacy');
        $access  = $data['access'];


        if ($access != Post::TYPE_PUBLIC && $access != Post::TYPE_PRIVATE) {
            
            return $this->response->error('Access only 1, 0');
        }

        $access = $access == Post::TYPE_PRIVATE ? $access = 'private' : $access = 'public';

        $valid = $this->checkPermition([
            'tag'=>count($arrTags),
            'image'=>count($arrImages),
            $access=> '',
        ]);

        if ($valid) {
            
            return $valid;
        }

        if ($privacy && !$data['access']) {
            $PostPrivacy = [];
            $date = date('Y-m-d h:m:s');

            if ($privacy['contact']) {
                foreach ($privacy['contact'] as $value) {
                    $PostPrivacy[] = [
                        'post_id' => $postId,
                        'access_id' => $value,
                        'type' => 'contact',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            if ($privacy['group']) {
                foreach ($privacy['group'] as $value) {
                    $PostPrivacy[] = [
                        'post_id' => $postId,
                        'access_id' => $value,
                        'type' => 'group',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            PostPrivacy::where('post_id', $postId)->delete();
            PostPrivacy::insert($PostPrivacy);
        }

        $objPost = Post::withoutGlobalScope('expired_at_scope')->where('id', $postId)->first();
        $objPost->update($data);

        if (count($arrTags)) {
            $this->updateTagsForPost($arrTags, $objPost, $objUser);
        }

        if (count($arrImages)) {
            $this->deleteImageFile($objPost);
            $this->moveFilesToDestinationFolder($objPost, $arrImages);
        }

        $objPost->load(['tags.tag', 'images']);

        return $this->response->show($objPost, $this->postTransFormer);
    }

    /**
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyPosts($postId)
    {
        if (Post::where('user_id', $this->userId)->where('id', $postId)->delete()) {
            
            return $this->response->groupsPostsDestroy();
        }

        return $this->response->error('Please enter a valid post id');
    }

    /**
     * @param $postId
     * @param $message
     * @param $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessageForPost($postId, $message, $userId = null)
    {
        $senderUser = $this->fetchLoggedInUser();
        $senderUserId = $senderUser->id;
        $receiverUser = $userId ? User::where('id',$userId)->first() : $this->fetchUserOfPostId($postId);
        if(!$receiverUser){
            
            return $this->response->error('Please enter a valid post id');
        }
        $receiverUserId = $receiverUser->id;

        $objUserMessage = $this->sendMessageForUser($senderUserId, $receiverUserId, $message, $postId);

        $this->sendFirebaseMessage($senderUser, $receiverUser, $message);

        Activity::UserSendMessageLog($objUserMessage);

        return $this->response->show($objUserMessage, $this->userMessageTransformer);
    }

    /**
     * Reply to the user's message
     *
     * @param $postId
     * @param $receiverId
     * @param $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function replyToMessage($postId, $receiverId, $message)
    {
        $user = $this->fetchLoggedInUser();
        try{
            $userMessage = UserMessage::create([
                'sender_id' => $user->id,
                'receiver_id' => $receiverId,
                'post_id' => $postId,
                'message' => $message
            ]);
        }catch (\Exception $e){
            
            return $this->response->error('Please enter a valid data');
        }

        return $this->response->show($userMessage, $this->userMessageTransformer);
    }

    /**
     * @param $arrTags
     * @param $post
     * @param $user
     * @internal param $postId
     */
    private function updateTagsForPost($arrTags, $post, $user)
    {
        $post->tags()->delete();
        foreach ($arrTags as $tag) {
            if ($tag == '') {
                continue;
            }
            $objTag = Tag::firstOrCreate(['name' => $tag]);
            $this->postTag->create([
                'post_id' => $post->id,
                'tag_id'  => $objTag->id
            ]);
        }
    }

    /**
     * @param $objPost
     * @param $arrImages
     */
    private function moveFilesToDestinationFolder($objPost, $arrImages)
    {
        if (is_array($arrImages)) {
            foreach ($arrImages as $image) {
                $fileName = $image->getClientOriginalName();
                $destinationPath = $objPost->imageDestinationPath();

                $image->move($destinationPath, $fileName);

                $objPost->images()->create(['src' => $fileName]);
            }
        }
    }

    private function deleteImageFile($objPost)
    {
        \File::deleteDirectory($objPost->imageDestinationPath());
        PostImage::where('post_id', $objPost->id)->delete();
    }

    /**
     * @param $senderUserId
     * @param $receiverUserId
     * @param $message
     * @param $postId
     * @return $this
     */
    private function sendMessageForUser($senderUserId, $receiverUserId, $message, $postId)
    {
        $objUserMessage = UserMessage::create([
            'sender_id'   => $senderUserId,
            'receiver_id' => $receiverUserId,
            'post_id'     => $postId,
            'message'     => $message,
        ]);

        return $objUserMessage->load(['sender', 'receiver', 'post']);
    }

    /**
     * Send the message to the firebase cloud
     * so the Android and iOS app users can receive notifications
     *
     * @param $senderUser
     * @param $receiverUser
     * @param $message
     */
    private function sendFirebaseMessage($senderUser, $receiverUser, $message)
    {
        $response = $this->client->post('https://fcm.googleapis.com/fcm/send', [
            'headers' => [
                'Authorization' => 'key=AIzaSyAPu090bUDacpmAE5mZZ2ulw2Si7dIa93U'
            ],
            'json' => [
                "priority" => "high",
                "notification" => [
                    "body" => "New message from " . $senderUser->fullName() . '\n' . $message
                ],
                "data" => [
                    'msg_type' => 'chat',
                    'chat' => [
                        'sender_id'  => $senderUser->id,
                        'first_name' => $senderUser->first_name,
                        'last_name'  => $senderUser->last_name,
                        'avatar'     => $senderUser->avatar,
                        'email'      => $senderUser->email,
                        'message'    => $message,
                        'timestamp'  => time()
                    ]
                ],
                'to' => $receiverUser->device_token,
            ]
        ]);
    }

    /**
     * @param $request
     * @param $post
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRePosts($request, $post)
    {
        if (!$post) {
            
            return $this->response->error('Post not found');
        }
        if (Auth::user()->type == User::TYPE_REGULAR) {
            
            return $this->response->error('You are not a Premium User');
        }

        $objUser = $this->fetchLoggedInUser();
        $arrTags = ($request->input('tags') != '') ? explode(',', array_pull($request, 'tags')) : false;
        if (count($request['image'])) {
            $arrImages = array_pull($request, 'image');
        } else {
            $arrImages = [];
        }


        $valid = $this->checkPermition([
            'tag'=>count($arrTags),
            'post'=>$objUser->posts->count(),
            'image'=>count($arrImages),
        ]);

        if ($valid) {
            
            return $valid;
        }
        $privacy = $request->input('privacy');

        if (isset($post->images()->first()->src)) {
            $oldImagesSrc =  $post->images()->first()->src;
        } else {
            $oldImagesSrc = false;
        }

        $data = [
            'title'         => $request->input('title') ? $request->input('title') : $post->title,
            'access'        => 0,
            'price'         => $post->price,
            'currency'      => $post->currency,
            'description'   => $request->input('description') ? $request->input('description') : $post->description,
            'location'      => $post->location,
            'expired_at'    => $request->input('expired_at') ? $request->input('expired_at') : $post->expired_at,
        ];
        $dt = new \DateTime($data['expired_at']);
        $carbon = Carbon::instance($dt);
        $data['expired_at'] = $carbon->toDateTimeString();
        $objPost = $objUser->posts()->create($data);

        if (is_array($privacy)) {
            $PostPrivacy = [];
            $date = date('Y-m-d h:m:s');
            if ($privacy['contact']) {
                foreach ($privacy['contact'] as $value) {
                    $PostPrivacy[] = [
                        'post_id' => $objPost->id,
                        'access_id' => $value,
                        'type' => 'contact',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            if ($privacy['group']) {
                foreach ($privacy['group'] as $value) {
                    $PostPrivacy[] = [
                        'post_id' => $objPost->id,
                        'access_id' => $value,
                        'type' => 'group',
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];
                }
            }

            PostPrivacy::insert($PostPrivacy);
        }

        if ($arrTags) {
            foreach ($arrTags as $tag) {
                if ($tag == '') {
                    continue;
                }

                $objTag = Tag::firstOrCreate(['name' => $tag]);
                $this->postTag->create([
                    'post_id' => $objPost->id,
                    'tag_id'  => $objTag->id
                ]);
            }
        } else {
            $postTags = $this->postTag->where('post_id', $post->id)->get();

            foreach ($postTags as $tags) {
                $this->postTag->create([
                    'post_id' => $objPost->id,
                    'tag_id' => $tags->tag_id
                ]);
            }
        }

        if ($arrImages) {
            $this->moveFilesToDestinationFolder($objPost, $arrImages);
        } elseif ($oldImagesSrc) {
            foreach ($post->images as $image) {
                Storage::disk('images')->copy('posts/images/' . $post->id . '/' . $oldImagesSrc, 'posts/images/' . $objPost->id . '/' . $image->src);
                PostImage::create(['src' => $image->src, 'post_id' => $objPost->id]);
            }
        }

        $objPost->load(['tags.tag', 'images']);
        Activity::UserCreatedPostLog($objPost, $objUser);

        return $this->response->show($objPost, $this->postTransFormer);
    }
    
    public function seeNot($data)
    {
        $notification = Notification::where('id', $data['not_id'])->where('is_see', false)->first();

        if ($notification) {
            $notification->is_see = true;
            $notification->save();

            return $this->response->show($notification, $this->natificationTransFormer);
        }

        return $this->response->error('Please enter a valid notification id');
    }
    
    public function getAllNot($id)
    {
        $data = Notification::Where('user_id', $id)->where('is_see', false)->get();

        if (count($data) > 0) {
            
            return $this->response->collection($data, $this->natificationTransFormer);
        }

        return $this->response->error('Please enter a valid user id');
    }

    public function createNot($request)
    {
        //        if(Notification::where('post_id',$request['post_id'])->where('user_id',$request['user_id'])->first()){
//            return $this->response->error('Please enter a valid data');
//        }

        $data = $this->response->show(Notification::firstOrCreate(['post_id'=>$request['post_id'], 'user_id'=>$request['user_id'], 'is_see'=>false]), $this->natificationTransFormer);
        if ($data) {
            
            return $data;
        }
        return $this->response->error('Please enter a valid data');
    }

    public function getUserTags()
    {
        return $this->tagSubscribe->where('user_id', Auth::id())->get();
    }

    public function createOrUpdateUserTag($data)
    {
        $this->tagSubscribe->where('user_id', Auth::id)->delete();
        $this->tagSubscribe->insert($data);
        
        return $this->tagSubscribe->create($data);
    }

    public function deleteUserTag($id)
    {
        return $this->tagSubscribe->where('id', $id)->delete();
    }

    public function checkLimit($id)
    {
        if (Auth::user()->type == User::TYPE_PREMIUM) {

            return $this->response->count([
                'success'=>true,
                'type'=>Auth::user()->type
            ]);
        } elseif (Post::where('user_id', $id)->count() < Post::REGULAR_POST_COUNT) {

            return $this->response->count([
                'success'=>true,
                'type'=>Auth::user()->type
            ]);
        }

        return $this->response->count([
            'success'=>false,
            'type'=>Auth::user()->type
        ]);
    }

    public function checkPermition($data, $id = false)
    {
        if ($id) {
            $user = User::where('id', $id)->first();
        } else {
            $user = Auth::user();
        }
        
        if ($user->type == User::TYPE_PREMIUM) {
            foreach ($data as $key => $value) {
                if ($user->premium[$key] === true || ($user->premium[$key] && $user->premium[$key] >= $value)) {
                    continue;
                } else {
                    $int = is_numeric($user->premium[$key]) ? $user->premium[$key] : '';
                    return $this->response->permError($key, $int);
                }
            }
            return false;
        }
        
        foreach ($data as $key => $value) {
            foreach ($data as $key => $value) {
                if ($user->regular[$key] === true || ($user->regular[$key] && $user->regular[$key] >= $value)) {
                    continue;
                } else {
                    $int = is_numeric($user->regular[$key]) ? $user->regular[$key] : '';
                    return $this->response->permError($key, $int);
                }
            }
        }
        return false;
    }
}
