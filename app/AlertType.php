<?php

namespace App;

use App\BaseModel;

class AlertType extends BaseModel
{
    protected $fillable = ['name'];
    
    public  $timestamps = false;
}
