<?php

namespace App;

use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserContact extends BaseModel
{
    use SoftDeletes;

    protected $table = 'user_contacts';

    protected $fillable = ['user_id', 'contact_id', 'status', 'deleted_at', 'contact_token', 'contact_email'];
    
    public function contact()
    {
        return $this->belongsTo(User::class, 'contact_id', 'id');
    }

    public function invite()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
