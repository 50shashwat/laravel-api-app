<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;
use App\UserContact;
use App\User;
use Illuminate\Support\Facades\Auth;
use Mail;

class AdminCreateContact extends Request
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
            'contact_id' => 'required',
        ];
    }

    public function persist($data = false)
    {
        $arrData = $this->all();
        $contact = [];
        $date = date('Y-m-d h:m:s');

        foreach ($arrData['contact_id'] as $contact_id)
        {
            $contactID = $contact_id;
            $token = null;
            $email = null;
            
            if(!is_numeric($contact_id)){
                if(filter_var($contact_id, FILTER_VALIDATE_EMAIL)){
                    $user = User::where('email',$contact_id)->first();

                    if(!$user){
                        $contactID = null;
                        $email = $contact_id;
                        $token = md5(time().$contact_id);
                        Mail::send('emails.welcome', ['token' => $token, 'email' => $email], function ($m) use ($email) {
                            $m->from('support@pallit-test.ml', 'Pallit');
                            $m->to($email, $email)->subject('Invitation');
                        });
                    } else {
                        $contactID = $user->id;
                    }
                }
            }

            $contact[] = [
                'user_id'     => $arrData['user_id'],
                'contact_id'  => $contactID,
                'contact_token' => $token,
                'contact_email' => $email,
                'created_at'  => $date,
                'updated_at'  => $date,
            ];

        }

        UserContact::where('user_id', $arrData['user_id'])->delete();

        UserContact::insert($contact);
        return redirect()->route('admin.users.info',$arrData['user_id']);
    }
}
