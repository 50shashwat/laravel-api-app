<?php

namespace App;

use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroups extends BaseModel
{
    use SoftDeletes;
    
    protected $table = 'user_groups';

    protected $fillable = ['group_id', 'user_id'];

    public function userInfo()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    
}
