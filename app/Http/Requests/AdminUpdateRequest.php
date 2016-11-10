<?php

namespace App\Http\Requests;

use Auth;

class AdminUpdateRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
//        return (Auth::guard('admin')->check() && (Auth::guard('admin')->id() == $this->segment(2)));
        return (Auth::guard('admin')->check());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email'    => 'required|email|unique:admins,id,' . $this->segment(2),
            'avatar'   => 'mimes:jpeg,jpg,png'
        ];
    }
}
