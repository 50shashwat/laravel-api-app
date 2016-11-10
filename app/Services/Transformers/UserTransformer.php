<?php

namespace App\Services\Transformers;


use App\User;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class UserTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {

        return [
            'id'           => $user->id,
            'first_name'   => $user->first_name,
            'last_name'    => $user->last_name,
            'email'        => $user->email,
            'country'      => $user->country,
            'avatar'       => $user->avatar,
            'company_name' => $user->company_name,
            'biography'    => $user->biography,
            'url'          => $user->url,
            'telephone'    => $user->telephone,
            'address'      => $user->address,
            'is_active'    => (bool) $user->active,
            'data'         => $this->fetchPosts($user->posts),
            'token'        => $user->token,
            'device_token' => $user->device_token,
            'quickblox_id' => (int) $user->quickblox->quickblox_id,
            'expired_at'   => $user->expired_at,
        ];
    }

    private function fetchPosts($posts)
    {
        $arrPosts = [];

        foreach($posts as $post)
        {
            array_push($arrPosts,[
                'id'               => $post->id,
                'title'            => $post->title,
                'description'      => $post->description,
                'access'           => (int) $post->access,
                'price' => [
                    'value' =>  $post->price,
                    'currency' => $post->currency
                ],
                'expired_at'       => (-1 * Carbon::parse($post->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
                'images'           => $this->getImages($post),
                'tags'             => $this->getTags($post),
                'conversation'     => $post->conversation,
                'created_at'       => $post->created_at,
                'updated_at'       => $post->updated_at
            ]);
        }

        return $arrPosts;
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
}