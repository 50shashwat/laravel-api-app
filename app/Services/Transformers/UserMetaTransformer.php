<?php

namespace App\Services\Transformers;


use App\User;
use League\Fractal\TransformerAbstract;

class UserMetaTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        return [
            'sign_up_date' => $user->created_at,
            'postings' => $user->posts->count(),
            'messages_sent' => $user->sent->count(),
            'messages_received' => $user->received->count()
        ];
    }
}