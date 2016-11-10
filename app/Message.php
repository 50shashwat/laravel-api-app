<?php

namespace App;

use App\BaseModel;

class Message extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['text','post_id'];

    /**
     * Relation between message and post models
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function posts()
    {
        return $this->belongsTo(Post::class,'post_id');
    }

    public function user()
    {
        return $this->hasMany(UserMessage::class);
    }
}
