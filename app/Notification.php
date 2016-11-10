<?php

namespace App;

use App\BaseModel;

class Notification extends BaseModel
{
    
    protected $fillable = [
        'id',
        'user_id',
        'post_id',
        'is_see',
    ];
}
