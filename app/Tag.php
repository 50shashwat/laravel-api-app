<?php

namespace App;

use App\BaseModel;

class Tag extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * @TODO://change the name of relation
     * Relation between tag and postTag models
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function post()
    {
        return $this->hasMany(PostTag::class);
    }
}
