<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Carbon\Carbon;
use \Auth;
use App\QuickbloxUserData;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email'    ,'password'    , 'company_name',
        'avatar'   ,'biography'   , 'url'   ,
        'telephone','address'     , 'code'  ,
        'active'   ,'device_token','country',
        'type'     ,'expired_at'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Destination path of user's avatar image
     *
     * @return string
     */
/*
 * Type REGULAR User
 * Type PREMIUM User
 * */
    const TYPE_REGULAR = 0;
    const TYPE_PREMIUM = 1;

    public $premium = [
        'post'=> true,
        'tag'=> 5,
        'image'=> 8,
        'repost'=> true,
        'public'=> true,
        'private'=> true,
    ];

    public $regular = [
        'post'=> 7,
        'tag'=> 2,
        'image'=> 4,
        'repost'=> false,
        'public'=> true,
        'private'=> false,
    ];

    public function getRegular()
    {
        return $this->regular;
    }
    
    public function imageDestinationPath()
    {
        return "uploads/avatars/users/{$this->id}/";
    }

    /**
     * The name of user's avatar image
     *
     * @return string
     */
    public function generateAvatarName()
    {
        return "{$this->first_name}-avatar-" . uniqid() . ".";
    }

    public function getAvatarAttribute($value)
    {
        $value ? $value = $this->imageDestinationPath() . $value : $value = '';

        return $value;
    }

    /**
     * @return string
     */
    public function getAvatarImage()
    {
        if($this->avatar != '')
        {
            return '/' . $this->imageDestinationPath() . $this->avatar;
        }

        return 'http://www.gravatar.com/avatar/' .md5(strtolower(trim($this->email)));
    }

    /**
     * Automatically bcrypt the given password
     *
     * @param $value
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * @param $value
     * @return string
     */
    public function getBiographyAttribute($value)
    {
        return $value ?: 'No Biography provided';
    }

    /**
     * @param $value
     * @return string
     */
    public function getCompanyNameAttribute($value)
    {
        return $value ?: 'No company name provided';
    }

    /**
     * @param $value
     * @return string
     */
    public function getUrlAttribute($value)
    {
        return $value ?: 'No url provided';
    }

    /**
     * @param $value
     * @return string
     */
    public function getTelephoneAttribute($value)
    {
        return $value ?: 'No telephone provided';
    }

    /**
     * @param $value
     * @return string
     */
    public function getAddressAttribute($value)
    {
        return $value ?: 'No address provided';
    }

    /**
     * Get full name as string
     *
     * @return string
     */
    public function fullName()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Relation between user and post models
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function groups()
    {
        return $this->hasMany(Groups::class);
    }
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sent()
    {
        return $this->hasMany(UserMessage::class,'sender_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function received()
    {
        return $this->hasMany(UserMessage::class,'receiver_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favourites()
    {
        return $this->hasMany(Favourite::class);
    }    
    
    public function transaction()
    {
        return $this->hasOne(Transaction::class)->orderBy('id', 'desc');
    }

    /**
     * Get how many posts can create user
     *
     * @return int
     */
    public function getCreatedAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }

    public function getUpdatedAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }

    public function getDeleteAtAttribute($value)
    {
        if($value){
            $dt = new \DateTime($value);
            $carbon = Carbon::instance($dt);
            return  $carbon->format('H:i, j F Y');
        }
        return $value;
    }

    public function quickblox()
    {
        return $this->hasOne(QuickbloxUserData::class);
    }

    public function quickbloxId()
    {
        return $this->hasOne(QuickbloxUserData::class)->select('quickblox_id');
    }
}
