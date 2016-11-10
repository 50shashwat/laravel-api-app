<?php

namespace App\Services\Transformers;


use App\Conversation;
use League\Fractal\TransformerAbstract;

class ConversationTransFormer extends TransformerAbstract
{
    /**
     * @param Conversation $country
     * @return array
     */
    public function transform(Conversation $conversation)
    {
        return [
            'user_1' => $conversation->user($conversation->member_1_id),
            'user_2' => $conversation->user($conversation->member_2_id),
            'post' => $conversation->post,
            'started' => $conversation->created_at,
            'finished' => $conversation->updated_at,
        ];
    }

}