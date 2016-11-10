<?php

namespace App\Http\Requests;

class GroupsRequest extends BaseRequest
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
        if($this->method() == 'DELETE')
        {
            return [
                'groups'   => 'required',
                'groups.*' => 'required|numeric'
            ];
        }

        return [
            'name' => 'required'
        ];
    }
}
