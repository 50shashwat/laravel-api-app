<?php

namespace App\Services\Transformers;


use App\User;
use League\Fractal\TransformerAbstract;
use App\Transaction;
use Carbon\Carbon;
use phpDocumentor\Reflection\Types\Integer;

class UserDataTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        // commented the first and last name from api response . As per the request they
        // don't need the first and last name in the api response.
        return [
            'id'            => (int)    $user->id,
            'email'         => (String) $user->email,
            'login'         => (String) $user->email,
            'country'       => (String) $user->country,
            'avatar'        => (String) $user->avatar,
            'company'       => (String) $user->company_name,
            'biography'     => (String) $user->biography,
            'token'         => (String) $user->token,
            'expire_date'   => (String) $user->type == User::TYPE_PREMIUM ? $user->transaction->expires_date   :'',
            'type'          => (int)    $user->type,
            'product_id'    => (String) $user->type == User::TYPE_PREMIUM ? $user->transaction->product_id     :'',
            'purchase_date' => (String) $user->type == User::TYPE_PREMIUM ? $user->transaction->purchase_date  :'',
            'transaction_id'=> (String) $user->type == User::TYPE_PREMIUM ? $user->transaction->transaction_id :'',
            'quickblox_id'  => (int)    $user->quickblox->quickblox_id,
            'password'      => (String) $user->QuickBloxPassword,
        ];
    }
}