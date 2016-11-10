<?php

namespace App\Services\Transformers;

use App\UserMessage;
use League\Fractal\TransformerAbstract;
use Carbon\Carbon;

class UserMessageTransformer extends TransformerAbstract
{
    /**
     * @param UserMessage $userMessage
     * @return array
     */
    public function transform(UserMessage $userMessage)
    {
        return [
            'sender'   => $this->fetchUser($userMessage->sender),
            'receiver' => $this->fetchUser($userMessage->receiver),
            'post'     => $this->fetchPost($userMessage->post),
            'message'  => $userMessage->message,
        ];
    }

    /**
     * Get information that we need from user object
     *
     * @param $user
     * @return array
     */
    private function fetchUser($user)
    {
        return [
            'id'         => $user->id,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'is_active'  => (bool) $user->active,
            'device_token' => $user->device_token
        ];
    }

    /**
     * Get the post information that we need
     *
     * @param $post
     * @return array
     */
    private function fetchPost($post)
    {
        return [
            'id'          => $post->id,
            'title'       => $post->title,
            'description' => $post->description,
            'location'    => $post->location,
            'access'  => (int) $post->access,
            'price' => [
                'value' =>  $post->price,
                'currency' => $post->currency
            ],
            'expired_at'=> (-1 * Carbon::parse($post->expired_at)->diffInDays(Carbon::today(), false)) . ' day',
        ];
    }
}