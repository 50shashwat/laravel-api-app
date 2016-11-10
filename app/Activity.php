<?php

namespace App;

use App\BaseModel;
use Carbon\Carbon;

class Activity extends BaseModel
{
    protected $fillable = ['user_id','type_id','message','ip'];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function type()
    {
        return $this->belongsTo(ActivityType::class,'type_id');
    }

    public function scopeSpanningDays($query, $days, $typeId)
    {
        return $query->oldest()->whereDate(
            'created_at', '>=', Carbon::now()->subDays($days)
        )->whereTypeId($typeId)->groupBy('created_at');
    }

}
