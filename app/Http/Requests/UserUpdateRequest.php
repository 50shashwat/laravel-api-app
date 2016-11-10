<?php

namespace App\Http\Requests;

use Tymon\JWTAuth\Facades\JWTAuth;

class UserUpdateRequest extends BaseRequest
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
//        $user = JWTAuth::parseToken()->toUser();

        return [
            'old_password'          => 'sometimes',
            'password'              => 'sometimes',
            'company_name'          => 'sometimes',
            'biography'             => 'sometimes'
//            'email'                 => 'unique:users,email,' . (is_null($user) ? null : $user->id). ',id'
        ];
    }
}
