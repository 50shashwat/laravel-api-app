<?php

namespace App\Http\Requests;

class TransactionRequest extends BaseRequest
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
        return [
            'transaction_id' => 'required',
            'purchase_date' => 'required',
            'product_id' => 'required',
            'expired_at' => 'required'
        ];
    }
}
