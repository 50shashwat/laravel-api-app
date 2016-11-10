<?php

namespace App\Services\Transformers\Users;

use App\UserMessage;
use League\Fractal\TransformerAbstract;

class ChatHistoryTransformer extends TransformerAbstract
{
    /**
     * @param $chatMessages
     * @return array
     */
    public function transform($chatMessages)
    {
        return [
            'messages_count' => $chatMessages->count(),
            'messages' => $this->getMessages($chatMessages)
        ];
    }

    /**
     * Retrieve chat message
     *
     * @param $userMessages
     * @return array
     */
    private function getMessages($userMessages)
    {

        $arrMessages = [];

        foreach($userMessages as $objMessage)
        {
            $message = [
                'message' => $objMessage->message,
                'time'    => $objMessage->created_at,
                'sender'  => [
                    'id' => $objMessage->sender_id,
                    'avatar' => $objMessage->sender->avatar
                ],
                'receiver'  => [
                    'id' => $objMessage->receiver_id,
                    'avatar' => $objMessage->receiver->avatar
                ]
            ];

            array_push($arrMessages,$message);
        }

        return $arrMessages;
    }


}