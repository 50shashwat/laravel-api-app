<?php

namespace App;

use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Groups extends BaseModel
{
    use SoftDeletes;
    
    protected $table = 'groups';
    
    protected $fillable = ['user_id', 'name'];

    public function contacts()
    {
        return $this->belongsToMany(User::class, 'user_groups', 'group_id', 'user_id');
    }
}
