<?php

namespace App\Http\Requests;


use App\User;
use Carbon\Carbon;
use App\Http\Requests\Request;


class AdminCreateUser extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name'   => 'required',
            'last_name'    => 'required',
            'email'        => 'required|email|unique:users',
            'company_name' => 'required',
            'url'          => 'required',
            'biography'    => 'required',
            'telephone'    => 'required',
            'address'      => 'required',
            'password'     => 'required',
            'expired_at'   => 'required|date_format:d/m/Y',
            'avatar'       => 'mimes:jpeg,png',
            
        ];
    }

    public function persist()
    {
        $arrData = $this->all();
        $arrData['expired_at'] =  Carbon::parse(str_replace('/', '-', $arrData['expired_at']));
        $user = User::create($arrData);
        if(! isset($arrData['active']))
        {
            $user->active = 1;
            $user->code = '';
        }
        if(isset($arrData['avatar'])){
            $objAvatar = array_pull($arrData,'avatar');
            $extension = $objAvatar->getClientOriginalExtension();
            $fileName = $user->generateAvatarName() . $extension;
            $destinationPath = $user->imageDestinationPath();
            $objAvatar->move($destinationPath, $fileName);
            $user->avatar = $fileName;
        }

        $user->save();

        return redirect()->route('admin.users.index');
    }
}
