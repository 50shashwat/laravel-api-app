<?php

namespace App;

use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends BaseModel
{

    use SoftDeletes;
    const PAYMENT_METHOD = [
         'com.gss.monthly' =>'ONE_MONTH',
         'com.gss.quarterly'=>'FOUR_MONTH',
         'com.gss.yearly'=>'ONE_YEAR',
         'com.mindmobapp.download'=>'Test_Currency',
    ];

    
    protected $fillable = [
        'original_purchase_date_pst',
        'id',
        'user_id',
        'original_transaction_id',
        'original_purchase_date_ms',
        'transaction_id',
        'quantity',
        'bvrs',
        'purchase_date_ms',
        'purchase_date',
        'original_purchase_date',
        'purchase_date_pst',
        'bid',
        'item_id',
        'product_id',
        'expires_date',
        'expires_date_ms',
        'expires_date_pst',
        'web_order_line_item_id',
        'is_trial_period'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
