<?php

namespace App\Http\Controllers\Api;


use App\Filters\PostsFilters;
use App\Http\Controllers\Controller;
use App\Repositories\Api\SearchRepository;

class SearchController extends Controller
{
    /**
     * @var SearchRepository
     */
    protected $searchRepository;

    /**
     * SearchController constructor.
     * @param SearchRepository $searchRepository
     */
    public function __construct(SearchRepository $searchRepository)
    {
        $this->searchRepository = $searchRepository;
    }


    /**
     * Get all posts (filter if needed)
     * 
     * @param PostsFilters $filters
     * @return mixed
     */
    public function getPosts(PostsFilters $filters)
    {
        return $this->searchRepository->getPosts($filters);
        
    }
}