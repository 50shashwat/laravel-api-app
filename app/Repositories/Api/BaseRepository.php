<?php

namespace App\Repositories\Api;

use App\Post;
use JWTAuth;

class BaseRepository
{
    /**
     * @return mixed
     */
    public function fetchLoggedInUser()
    {
        return JWTAuth::parseToken()->toUser();
    }

    /**
     * @param $postId
     * @return mixed
     */
    public function fetchUserOfPostId($postId)
    {
        $objPost = Post::with('user')->where('id', $postId)->first();
        
        return $objPost ? $objPost->user : false;
    }

    /**
     * @return mixed
     */
    public function fetchLoggedInUserId()
    {
        return $this->fetchLoggedInUser()->id;
    }
}