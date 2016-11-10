<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = ['name','email','password','avatar'];

    /**
     * Destination path of admin's avatar image
     *
     * @return string
     */
    public function imageDestinationPath()
    {
        return "uploads/avatars/admins/{$this->id}/";
    }

    /**
     * Generate admin's avatar image file name
     *
     * @return string
     */
    public function generateAvatarName()
    {
        return "{$this->name}-avatar-" . uniqid() . ".";
    }

    /**
     * Get current avatar image of admin
     *
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

}
