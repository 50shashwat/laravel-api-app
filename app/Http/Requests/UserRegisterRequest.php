<?php

namespace App\Http\Requests;

class UserRegisterRequest extends BaseRequest
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
        // commented the first and last name from api register / signup request . As per the request they
        // don't need the first and last name in the api register / signup request.
        return [
//            'first_name' => 'required',
//            'last_name'  => 'required',
            'email'      => 'required|email|unique:users',
            'avatar'     => 'mimes:jpeg,png',
            'password'   => 'required',
            'type'       => 'required|in:0,1',
//            'transaction_id' => 'required',
//            'purchase_date' => 'required',
//            'product_id' => 'required',
//            'expired_at' => 'required',
        ];
    }
}
