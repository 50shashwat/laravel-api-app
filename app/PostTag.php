<?php

namespace App;

use App\BaseModel;

class PostTag extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['post_id','tag_id'];

    /**
     * Relation between postTag and post models
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post()
    {
        return $this->belongsTo(Post::class,'post_id');
    }

    /**
     * Relation between postTag and tag models
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tag()
    {
        return $this->belongsTo(Tag::class,'tag_id');
    }
}
