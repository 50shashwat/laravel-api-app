<?php

namespace App\Repositories\Api;


use App\Filters\PostsFilters;
use App\Http\Responses\ApiResponse;
use App\Post;
use App\Services\Transformers\SearchPostTransformer;
use App\Tag;

class SearchRepository
{
    /**
     * @var Post
     */
    protected $post;

    /**
     * @var Tag
     */
    protected $tag;

    /**
     * @var SearchPostTransformer
     */
    protected $postTransformer;
    /**
     * @var ApiResponse
     */
    protected $response;

    /**
     * SearchRepository constructor.
     * @param Post $post
     * @param Tag $tag
     * @param SearchPostTransformer $postTransformer
     * @param ApiResponse $response
     */
    public function __construct(Post $post, Tag $tag, SearchPostTransformer $postTransformer, ApiResponse $response)
    {
        $this->post = $post;
        $this->tag  = $tag;
        $this->postTransformer = $postTransformer;
        $this->response = $response;
    }

    /**
     * @param PostsFilters $filters
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPosts(PostsFilters $filters)
    {
        $posts = Post::getPosts()->filter($filters)->get();

        return $this->response->collection($posts,$this->postTransformer);
    }
}