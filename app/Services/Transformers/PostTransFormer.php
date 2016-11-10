<?php

namespace App\Services\Transformers;


use App\Post;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class PostTransFormer extends TransformerAbstract
{
    /**
     * @param Post $post
     * @return array
     */
    public function transform(Post $post)
    {
        return [
            'id'               => $post->id,
            'title'            => $post->title,
            'access'           => (int) $post->access,
            'repost_access'    => $post->access ? 0 : 1,
            'description'      => $post->description,
            'expired_at'       => (-1 * Carbon::parse($post->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
            'price' => [
                'value' =>  $post->price,
                'currency' => $post->currency
            ],
            'images'           => $this->getImages($post),
            'tags'             => $this->getTags($post),
            'created_at'       => $post->created_at,
            'updated_at'       => $post->updated_at,
            'user'             => $this->getUser($post->user),
            'conversation'     => $post->conversation
        ];
    }

    /**
     * @param $post
     * @return array
     */
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

    private function  getUser($user)
    {
        $user->quickblox_id = $user->quickblox ? $user->quickblox->id : '';



        return [
            "id" => $user->id,
            "email" => $user->email,
            "company_name" => $user->company_name,
            "avatar" => $user->avatar,
            "biography" => $user->biography,
            "url" => $user->url,
            "telephone" => $user->telephone,
            "address" => $user->address,
            "active" => $user->active,
            "code" => $user->code,
            "created_at" => $user->created_at,
            "updated_at" => $user->updated_at,
            "device_token" => $user->device_token,
            "country" => $user->country,
            "type" => $user->type,
            "expired_at" => $user->expired_at,
            "quickblox_id"=> $user->quickblox ? $user->quickblox->quickblox_id : '',
        ];
    }
}