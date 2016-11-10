<?php

namespace App;

use App\BaseModel;

class TagSubscribe extends BaseModel
{
    /*
     * fillable filds
     * */
    protected $fillable = [
        'id',
        'user_id',
        'tag_id'
    ];
}
