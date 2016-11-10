<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;


class MessagesController extends Controller
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function sendMessage()
    {
        $response = $this->client->post('https://fcm.googleapis.com/fcm/send',[
            'headers' => [
                'Authorization' => 'key=AIzaSyAPu090bUDacpmAE5mZZ2ulw2Si7dIa93U'
            ],
            'json' => [
                "priority" => "high",
                "notification" => [
                    "body" => "Test notification"
                ],
                "data" => [
                    'message_type' => 'chat',
                    'chat' => [
                        'sender_id' => 123456,
                        'message' => 'Test message'
                    ]
                ],
                'to' => 'c-ZK8bXM_pE:APA91bHmU5q2f_PIIl5MV1be56sYwtUWK_eRU8OkbmPwds74E8Tuc8qURwwANSkpzkY2kIuJYAbS19x5UurOLLOY45H5wnEWkAMg9Ivg4QqadLLRZD-wOq5yoJrlnrlzcghZzaFCPBoJ',
            ]
        ]);

        dd(json_decode($response->getBody()));
    }
}