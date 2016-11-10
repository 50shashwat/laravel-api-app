<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Conversation extends BaseModel
{
    protected $fillable = [
        'member_1_id',
        'member_2_id',
        'post_id'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user($id)
    {
        return User::where('id',$id)->select('id','email')->first();
    }
}
