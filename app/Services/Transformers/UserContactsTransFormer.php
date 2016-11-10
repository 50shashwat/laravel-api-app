<?php
namespace App\Services\Transformers;

use App\UserContact;
use Illuminate\Support\Facades\Auth;
use League\Fractal\TransformerAbstract;

class UserContactsTransFormer extends TransformerAbstract
{
    public function transform(UserContact $userContact)
    {
        if($userContact->contact_id === null && $userContact->contact_email !== null){
            $contact = $userContact->contact_email;
        } elseif($userContact->user_id == Auth::id()){
            $contact = $this->getUserInfo($userContact->contact);
        } elseif ($userContact->contact_id == Auth::id()){
            $contact = $this->getUserInfo($userContact->invite);
        } else {
            $contact = $this->getUserInfo($userContact->contact);
        }
        
        return [
            'status'           => $userContact->status,
            'contact'          => $contact,
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
            'device_token' => $user->device_token,
            'expired_at'   => $user->expired_at
        ];
    }
}