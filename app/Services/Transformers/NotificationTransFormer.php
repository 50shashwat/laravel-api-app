<?php

namespace App\Services\Transformers;


use App\Post;
use League\Fractal\TransformerAbstract;
use App\Notification;

class NotificationTransFormer extends TransformerAbstract
{
    /**
     * @param Post $post
     * @return array
     */
    public function transform(Notification $notification)
    {
        return [
            'id'                => $notification->id,
            'user_id'           => (int) $notification->user_id,
            'post_id'           => (int) $notification->post_id,
            'is_see'            => (int) $notification->is_see,
            'created_at'        => $notification->created_at,
            'updated_at'        => $notification->updated_at,
        ];
    }

}