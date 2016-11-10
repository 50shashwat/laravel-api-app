<?php

namespace App;

use App\BaseModel;

class PostPrivacy extends BaseModel
{
    protected $table = 'post_privacy';

    public $timestamps = true;

    protected $fillable = ['post_id','access_id','type',];
}
