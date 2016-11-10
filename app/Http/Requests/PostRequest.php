<?php

namespace App\Http\Requests;


class PostRequest extends BaseRequest
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
        return $this->getRules();
    }

    private function getRules()
    {
        if($this->method() == 'PUT')
        {
            return [
                'title'             => 'required',
                'access'            => 'required|numeric',
                'description'       => 'required',
                'location'          => 'required',
                'price'             => 'required|numeric',
                'currency'          => 'required|alpha|size:3|currency',
                'expired_at'        => 'required',
                'image'             => 'required',
                'image.*'           => 'required|image',
                'privacy.contact.*' => 'numeric',
                'privacy.group.*'   => 'numeric'
                
            ];
        }
        else {
           return [
                'title'             => 'required',
                'access'            => 'required|numeric',
                'description'       => 'required',
                'location'          => 'required',
                'price'             => 'required|numeric',
                'currency'          => 'required|alpha|size:3|currency',
                'expired_at'        => 'required',
                'image'             => 'required',
                'image.*'           => 'required|image',
                'privacy.contact.*' => 'numeric',
                'privacy.group.*'   => 'numeric'
            ];
        }
    }
}
