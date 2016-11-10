<?php

namespace App;

use App\BaseModel;

class Country extends BaseModel
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function states()
    {
        return $this->hasMany(State::class,'country_id');
    }
}
