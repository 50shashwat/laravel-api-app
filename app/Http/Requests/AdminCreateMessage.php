<?php

namespace App\Http\Requests;

use App\Message;
use App\UserMessage;

class AdminCreateMessage extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'sender_id'   => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'post_id'     => 'required|exists:posts,id',
            'text'        => 'required'
        ];
    }

    public function persist()
    {
        $objMessage = Message::create([
            'text'    => $this->text,
            'post_id' => $this->post_id,
        ]);

        UserMessage::create([
            'message_id'  => $objMessage->id,
            'sender_id'   => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'post_id'     => $this->post_id,
            'message'     => $this->text,
        ]);
        
        return back();
    }
}
