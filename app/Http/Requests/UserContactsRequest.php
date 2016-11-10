<?php

namespace App\Http\Requests;

class UserContactsRequest extends BaseRequest
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
        $rules = [];
        
        $contacts = $this->input('contacts', []);

        foreach ($contacts as $key => $contact) {
           if(!intval($contact)){
               $rules['contacts.' . $key] = 'required|email';
           } else {
               $rules['contacts.' . $key] = 'required|numeric';
           }
        }

        return $rules;        
    }
}
