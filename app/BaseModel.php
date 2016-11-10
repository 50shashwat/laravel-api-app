<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class BaseModel extends Model
{
    public function getCreatedAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }

    public function getUpdatedAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }

    public function getDeleteAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }
}
