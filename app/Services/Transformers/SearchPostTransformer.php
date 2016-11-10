<?php

namespace App\Services\Transformers;


use App\Post;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class SearchPostTransformer extends TransformerAbstract
{
    /**
     * @param Post $post
     * @return array
     */
    public function transform(Post $post)
    {
        return [
            'id'          => $post->id,
            'title'       => $post->title,
            'access'      => (int) $post->access,
            'price' => [
                'value' =>  $post->price,
                'currency' => $post->currency
            ],
            'description' => $post->description,
            'location'    => $post->location,
            'expired_at'  => (-1 * Carbon::parse($post->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
            'created_at'  => $post->created_at,
            'updated_at'  => $post->updated_at,
            'images'      => $this->getImages($post),
            'tags'        => $this->getTags($post),
            'user'        => $this->getUserInfo($post->user)
        ];

    }

    /**
     * @param $user
     * @return array
     */
    private function getUserInfo($user)
    {
        return [
            'id'           => $user->id,
            'first_name'   => $user->first_name,
            'last_name'    => $user->last_name,
            'email'        => $user->email,
            'company_name' => $user->company_name,
            'biography'    => $user->biography,
            'url'          => $user->url,
            'address'      => $user->address,
            'telephone'    => $user->telephone,
            'avatar'       => $user->avatar,
            'device_token' => $user->device_token
        ];
    }

    /**
     * @param $post
     * @return array
     */
    private function getTags($post)
    {
        return $this->getTagsForPost($post);
    }

    /**
     * @param $post
     * @return array
     */
    private function getTagsForPost($post)
    {
        $arrTags = [];

        foreach($post->tags as $postTag)
        {
            $arrTags[] = $postTag->tag->name;
        }

        return array_values($arrTags);
    }

    private function getImages($post)
    {
        $arrImages = [];
        $index = 0;
        foreach($post->images as $image)
        {

            $arrImages[$index]['url'] = $post->imageDestinationPath() . $image->src;
            list($width,$height) = getimagesize($post->imageDestinationPath() . $image->src);
            $arrImages[$index]['width'] = $width;
            $arrImages[$index]['height'] = $height;
            $index++;
        }

        return $arrImages;
    }
}