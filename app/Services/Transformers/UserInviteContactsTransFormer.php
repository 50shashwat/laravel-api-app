<?php
namespace App\Services\Transformers;


use App\Groups;
use App\UserContact;
use League\Fractal\TransformerAbstract;

class UserInviteContactsTransFormer extends TransformerAbstract
{
    public function transform(UserContact $userContact)
    {
        return [
            'status'           => $userContact->status,
            'contact'          => $this->getUserInfo($userContact->invite),
            'created_at'       => $userContact->created_at,
            'updated_at'       => $userContact->updated_at,
        ];
    }

    private function getUserInfo($user)
    {
        return [
            'id'           => $user->id,
            'first_name'   => $user->first_name,
            'last_name'    => $user->last_name,
            'email'        => $user->email,
            'company_name' => $user->company_name,
            'biography'    => $user->biography,
            'url'          => $user->url,
            'address'      => $user->address,
            'telephone'    => $user->telephone,
            'avatar'       => $user->avatar,
            'device_token' => $user->device_token
        ];
    }
}