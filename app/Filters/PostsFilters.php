<?php

namespace App\Filters;

use App\Tag;

class PostsFilters extends QueryFilters
{
    /**
     * Filter by title
     * 
     * @param $title
     * @return mixed
     */
    public function title($title)
    {
        return $this->builder->where('title','LIKE','%' . urldecode($title) . '%');
    }

    /**
     * Filter by tags
     * 
     * @param $tags
     * @return mixed
     */
    public function tags($tags)
    {
        $arrTags = Tag::whereIn('name',explode(',',$tags))->pluck('id');

        return $this->builder->whereHas('tags',function($query) use ($arrTags){
                $query->whereIn('tag_id',$arrTags);
        });
    }
}