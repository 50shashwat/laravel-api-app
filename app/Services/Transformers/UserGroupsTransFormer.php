<?php
namespace App\Services\Transformers;



use App\UserGroups;
use League\Fractal\TransformerAbstract;

class UserGroupsTransFormer extends TransformerAbstract
{
    public function transform(UserGroups $userGroups)
    {
        return [
            'userinfo'         => $this->getUserInfo($userGroups->userInfo),
            'created_at'       => $userGroups->created_at,
            'updated_at'       => $userGroups->updated_at,
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