<?php

namespace App;

use App\BaseModel;
use App\Scopes\ActiveScope;

class PostImage extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['src','post_id'];

    protected $attributes = array(
        'active' => 1
    );
    /**
     * Relation between postImage and post models
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post()
    {
        return $this->belongsTo(Post::class,'post_id');
    }


    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ActiveScope);
    }
}
