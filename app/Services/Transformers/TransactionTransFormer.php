<?php

namespace App\Services\Transformers;


use App\Transaction;
use League\Fractal\TransformerAbstract;

class TransactionTransFormer extends TransformerAbstract
{
    public function transform(Transaction $transaction)
    {
        return [
            'id'           => $transaction->id,
            'transaction_id'   => $transaction->transaction_id,
            'product_id'    => $transaction->product_id,
            'purchase_date'    => $transaction->purchase_date,
            'expires_date'    => $transaction->expires_date,
        ];
    }

}