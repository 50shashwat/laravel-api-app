<?php

namespace App\Services\Transformers;


use App\TagSubscribe;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class TagSubscribeTransFormer extends TransformerAbstract
{
    /**
     * @param TagSubscribe $post
     * @return array
     */
    public function transform(TagSubscribe $tagSubscribe)
    {
        return [
            'id'  => $tagSubscribe->id,
        ];
    }
    
    /**
     * @param $post
     * @return array
     */
    private function getTags($post)
    {
        $arrTags = [];
        
        foreach($post->tags as $postTag)
        {
            $arrTags[] = $postTag->tag->name;
        }

        return $arrTags;
    }
}