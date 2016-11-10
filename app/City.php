<?php

namespace App;

use App\BaseModel;

class City extends BaseModel
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function state()
    {
        return $this->belongsTo(State::class,'state_id');
    }
}
