<?php

namespace App\Services\Transformers\Users;


use App\User;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class UserFavouritesTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'biography' => $user->biography,
            'company_name' => $user->company_name,
            'url' => $user->url,
            'telephone' => $user->telephone,
            'address' => $user->address,
            'device_token' => $user->device_token,
            'data' => $this->fetchFavouritePosts($user->fresh()),
            'expired_at' => (-1 * Carbon::parse($user->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
        ];
    }

    private function fetchFavouritePosts($user)
    {
        $arrPosts = [];


        foreach ($user->favourites as $key => $favourite)
        {
            if($favourite->post != null)
            {
                $post = $favourite->post->load('tags.tag','images');
                array_push($arrPosts,[
                    'id' => $post->id,
                    'title' => $post->title,
                    'description' => $post->description,
                    'location' => $post->location,
                    'access'  => (int) $post->access,
                    'price' => [
                        'value' =>  $post->price,
                        'currency' => $post->currency
                    ],
                    'expired_at' => (-1 * Carbon::parse($post->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
                    'created_at' => $post->created_at,
                    'updated_at' => $post->updated_at,
                    'user'  => $this->fetchUserInfo($favourite->post->user),
                    'images' => $this->fetchImages($post,$post->images->pluck('src')),
                    'tags'  => $this->fetchTags($post->tags)
                ]);
//                $arrPosts[] = $favourite->post->load('tags','images');
            }
        }

        return $arrPosts;
    }

    private function fetchImages($post,$arrImages)
    {

        $arrReturn = [];
        $index = 0;
        foreach($arrImages as $img){
            $arrReturn[$index]['url'] = $post->imageDestinationPath() . $img;
            list($width,$height) = getimagesize($post->imageDestinationPath() . $img);
            $arrReturn[$index]['width'] = $width;
            $arrReturn[$index]['height'] = $height;
            $index++;
        }

        return $arrReturn;
    }

    private function fetchTags($tags)
    {
        $arrTags = [];
        foreach($tags as $objTag)
        {
           $arrTags[] = $objTag->tag->name;
        }

        return $arrTags;
    }

    private function fetchUserInfo($user)
    {
        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'company_name' => $user->company_name,
            'avatar' => $user->avatar,
            'biography' => $user->biography,
            'url' => $user->url,
            'telephone' => $user->telephone,
            'address' => $user->address,
            'country' => $user->country,
            'expired_at' => (-1 * Carbon::parse($user->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
        ];
    }
}