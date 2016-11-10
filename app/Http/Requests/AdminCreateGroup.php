<?php

namespace App\Http\Requests;

use App\Groups;
use App\Http\Requests\Request;
use App\UserGroups;

class AdminCreateGroup extends Request
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
            'user_id'    => 'required',
            'group_name' => 'required',
            'contact_id' => 'required',
        ];
    }
    public function persist()
    {
        $arrData = $this->all();
        $group =  Groups::create(['user_id' => $arrData['user_id'], 'name' => $arrData['group_name'] ]);

        foreach ($arrData['contact_id'] as $contact_id)
        {
            UserGroups::create(['group_id' => $group->id, 'user_id' => $contact_id]);
        }

        return redirect()->route('admin.users.info',$arrData['user_id']);
    }

    public function updateGroup()
    {
        $arrData = $this->all();

        Groups::where('id', $arrData['group_id'])->update(['name' => $arrData['group_name']]);
        UserGroups::where('group_id', $arrData['group_id'])->delete();
        foreach ($arrData['contact_id'] as $contact_id)
        {
            UserGroups::create(['group_id' => $arrData['group_id'], 'user_id' => $contact_id]);
        }

        return redirect()->route('admin.users.info',$arrData['user_id']);
    }
}
