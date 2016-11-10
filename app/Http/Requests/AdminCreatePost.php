<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;
use App\PostPrivacy;
use App\PostTag;
use App\Tag;
use App\User;

class AdminCreatePost extends Request
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
            'user_id'     => 'required|exists:users,id',
            'title'       => 'required',
            'access'      => 'required|numeric',
            'description' => 'required',
            'location'    => 'required',
            'expired_at'  => 'required',
            'price'       => 'required|numeric',
            'currency'    => 'required|alpha|size:3|currency',
            'tags'        => 'required',
            'image'       => 'required'
        ];
    }

    public function persist()
    {
        $arrData = $this->all();
        $arrTags = explode(',',array_pull($arrData,'tags'));
        $arrImages = array_pull($arrData,'image');
        $userContacts = array_pull($arrData,'user_contacts');
        $userGroups = array_pull($arrData,'user_groups');

        $user = User::findOrFail($this->user_id);

        $post = $user->posts()->create($arrData);

        if (!$arrData['access'])
        {
            $PostPrivacy = [];
            $date = date('Y-m-d h:m:s');

            if(is_array($userContacts))
            {
                foreach ($userContacts as $contact)
                {
                    if($contact)
                    {
                        $PostPrivacy[] = [
                            'post_id'    => $post->id,
                            'access_id'  => $contact,
                            'type'       => 'contact',
                            'created_at' => $date,
                            'updated_at' => $date,
                        ];
                    }

                }
            }
            if(is_array($userGroups)) {
                foreach ($userGroups as $group) {
                    if ($group) {
                        $PostPrivacy[] = [
                            'post_id' => $post->id,
                            'access_id' => $group,
                            'type' => 'group',
                            'created_at' => $date,
                            'updated_at' => $date,
                        ];
                    }

                }
            }
            PostPrivacy::insert($PostPrivacy);

        }

        foreach($arrTags as $tag)
        {
            $objTag = Tag::firstOrCreate(['name' => $tag]);

            PostTag::create([
                'post_id' => $post->id,
                'tag_id'  => $objTag->id
            ]);
        }

        foreach($arrImages as $image)
        {
            $fileName = $image->getClientOriginalName();

            $destinationPath = $post->imageDestinationPath();

            $image->move($destinationPath, $fileName);

            $post->images()->create(['src' => $fileName]);
        }

        return back();

    }
}
