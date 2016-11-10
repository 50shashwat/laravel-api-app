<?php

namespace App\Repositories\Admin;


use App\Admin;
use App\User;
use \Auth;
use Carbon\Carbon; 

class AdminRepository
{

    /**
     * Update admin's profile data by given ID
     *
     * @param $id
     * @param $data
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateAdmin($objAdmin, $data)
    {
        if(isset($data['avatar']))
        {
            $objAvatar = array_pull($data,'avatar');

            $this->updateAdminAvatar($objAvatar, $objAdmin);
        }
        $password = array_pull($data,'password');

        $this->updateAdminPassword($password,$objAdmin);

        $objAdmin->update($data);

        session()->flash('profileUpdate',true);
        return redirect()->back();
    }

    /**
     * Update admin's avatar image
     *
     * @param $objAvatar
     * @param $objAdmin
     */
    private function updateAdminAvatar($objAvatar, $objAdmin)
    {

        $extension = $objAvatar->getClientOriginalExtension();

        $fileName = $objAdmin->generateAvatarName() . $extension;
        $destinationPath = $objAdmin->imageDestinationPath();

        $objAvatar->move($destinationPath, $fileName);

        $objAdmin->update(['avatar' => $fileName]);
    }

    /**
     * Update admin's password
     *
     * @param $password
     * @param $objAdmin
     */
    private function updateAdminPassword($password, $objAdmin)
    {
        if($password != '')
        {
            $objAdmin->update([
                'password' => bcrypt($password)
            ]);
        }

    }

    /**
     * Get all users count
     *
     * @return array
     */
    public function getAllDataForDashboard()
    {
        $usersCount = User::count();

        return compact('usersCount');
    }

    /**
     * Get all users
     *
     * @return array
     */
    public function getAllUsers()
    {
        $users = User::all();

        return compact('users');
    }

    public function editUser($arrData){
        $arrData['expired_at'] =  Carbon::parse(str_replace('/', '-', $arrData['expired_at']));
        $objUser = User::where('id',$arrData['userId'])->first();
        
        if(isset($arrData['avatar']))
        {
            \File::deleteDirectory($objUser->imageDestinationPath());
            $this->moveFileToDestination(array_pull($arrData,'avatar'),$objUser);
        }

        $objUser->update($arrData);

        return redirect()->route('admin.users.index');
    }

    private function moveFileToDestination($objAvatar, $objUser)
    {
        $extension = $objAvatar->getClientOriginalExtension();

        $fileName = $objUser->generateAvatarName() . $extension;
        $destinationPath = $objUser->imageDestinationPath();

        $objAvatar->move($destinationPath, $fileName);

        $objUser->update([
            'avatar' => $fileName
        ]);

        return true;
    }
}