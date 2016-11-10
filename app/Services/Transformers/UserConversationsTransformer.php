<?php

namespace App\Services\Transformers;

use App\Post;
use App\User;
use Cache;
use League\Fractal\TransformerAbstract;

class UserConversationsTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        return [
            'conversations' => $this->getUserChatHistory($user)
        ];
    }

    private function getUserChatHistory($user)
    {
        $arrHistory = [];
        foreach($user->sent->toArray() as $sent)
        {
            $conversation = [
                'sender_id' => $sent['sender_id'],
                'receiver_id' => $sent['receiver_id'],
                'post_id' => $sent['post_id'],
                'message_time' => $user->sent()
                    ->where('receiver_id',$sent['receiver_id'])
                    ->orWhere(function ($query)use($sent){
                        return $query->where('sender_id',$sent['receiver_id'])
                            ->where('receiver_id',$sent['sender_id']);
                    })
                    ->orderBy('id','Desc')->first()->created_at
            ];

            if(! in_array($conversation,$arrHistory))
            {
                array_push($arrHistory,$conversation);
            }
        }

        foreach($user->received->toArray() as $received)
        {
            $conversation = [
                'sender_id' => $received['sender_id'],
                'receiver_id' => $received['receiver_id'],
                'post_id' => $received['post_id'],
                'message_time' => $user->received()
                    ->Where('receiver_id',$received['receiver_id'])
                    ->orWhere(function ($query)use($received){
                        return $query->where('sender_id',$received['receiver_id'])
                            ->where('receiver_id',$received['sender_id']);
                    })
                    ->orderBy('id','Desc')->first()->created_at
            ];

            if(! in_array($conversation,$arrHistory))
            {
                array_push($arrHistory,$conversation);
            }
        }

        return $this->getConversationsData($arrHistory);
    }

    private function getConversationsData($arrHistory)
    {
        $arrConversations = [];

        foreach($arrHistory as $history)
        {
            $receiverId = $history['receiver_id'];
            $postId = $history['post_id'];

            $objReceiver = Cache::rememberForever('receiver-' . $receiverId,function() use($receiverId) {
                return User::find($receiverId);
            });

            $objPost = Cache::rememberForever('post-' . $postId,function() use($postId) {
                return Post::find($postId);
            });

            $conversation = [
                'id' => $objReceiver->id,
                'company_name' => $objReceiver->company_name,
                'avatar'  => $objReceiver->avatar,
                'last_message_time'  => $history['message_time'],
                'post' => [
                    'id'    => $objPost->id,
                    'title' => $objPost->title
                ],
            ];

            array_push($arrConversations,$conversation);
        }

        return $arrConversations;
    }
}