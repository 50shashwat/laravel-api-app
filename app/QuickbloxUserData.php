<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuickbloxUserData extends Model
{
    protected $fillable = [
        'quickblox_id',
        'owner_id',
        'user_id',
        'password'
    ];
    
    public function user()
    {
        return $this->hasOne(User::class);    
    }
}
