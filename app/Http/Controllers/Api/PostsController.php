<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MessageRequest;
use App\Http\Requests\PostRequest;
use App\Http\Requests\RePostsRequest;
use App\Post;
use App\Repositories\Api\PostsRepository;
use Illuminate\Http\Request;
use \Auth;

class PostsController extends Controller
{
    /**
     * @var PostsRepository
     */
    private $postsRepository;

    /**
     * PostsController constructor.
     * @param PostsRepository $postsRepository
     */
    public function __construct(PostsRepository $postsRepository)
    {
        $this->postsRepository = $postsRepository;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll()
    {
        return $this->postsRepository->getAllPosts();
    }

    /**
     * @param PostRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createEditPost(PostRequest $request)
    {
        return $this->postsRepository->CreateOrUpdateNewPostForUser($request->all());
    }

    /**
     * @param PostRequest $request
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
//    public function updatePost(PostRequest $request, $postId)
//    {
//        return $this->postsRepository->updatePost($request->all(),$postId);
//    }

    /**
     * @param MessageRequest $request
     * @param $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(MessageRequest $request, $postId)
    {
        return $this->postsRepository->sendMessageForPost($postId,$request->text,$request->user_id);
    }

    /**
     * Reply to the message that user sent about the given post
     *
     * @param $postId
     * @param $userId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function replyToMessage($postId, $userId, Request $request)
    {
        return $this->postsRepository->replyToMessage($postId,$userId,$request->message);
    }

    public function destroy($postId)
    {
        return $this->postsRepository->destroyPosts($postId);
    }

    public function showPosts($postId)
    {
        return $this->postsRepository->showPosts($postId);
    }

    public function createRePosts(RePostsRequest $request, $postId)
    {
        return $this->postsRepository->createRePosts($request, Post::withoutGlobalScope('expired_at_scope')->where('id',$postId)->first());
    }

    public function checkLimit()
    {
        return $this->postsRepository->checkLimit(Auth::id());
    }

}