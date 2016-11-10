<?php

namespace App\Http\Controllers\Auth;

use App\Admin;
use App\Http\Requests\UserRegisterRequest;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use App\UserContact;

use Session;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Where to redirect users after logout
     *
     * @var string
     */
    protected $redirectAfterLogout = '/login';

    /**
     * Create a new authentication controller instance.
     *
     */
    public function __construct()
    {
        config(['auth.providers.users.model' => Admin::class]);
        $this->middleware('guest', ['except' => 'logout']);
    }

    private $registerView = 'register';

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'last_name' => 'max:255',
            'first_name' => 'max:255',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6'
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'first_name' => isset($data['first_name'])?$data['first_name']: '',
            'last_name' => isset($data['last_name'])?$data['last_name']: '',
            'email' => $data['email'],
            'company_name' => $data['company_name'],
            'password' => $data['password']
        ]);
    }

    public function  invitation(Request $request){

        if(isset($request->token) && isset($request->email))
        {
            $contact = User::where('email',$request->email)->first();
            if(!$contact){
                return view('register',['email'=>$request->email,'token' =>$request->token]);
            }else{
                return view('users.already_registr');
            }

        }
        
    }

    public function registerTest(){
        return redirect('register');
    }

    public function getLogout()
    {
        Auth::logout();
        Session::flush();
        return redirect('/login');
    }

    public function register(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            $this->throwValidationException(
                $request, $validator
            );
        }

        if(isset($request->user_token)){



            $user = $this->create($request->all());

            if($user) {
                UserContact::where('contact_token', $request->user_token)->update([
                    'contact_id' => $user->id,
                    'contact_token' => null,
                    'contact_email' => $request->email,
                    'created_at' => date('Y-m-d h:m:s'),
                    'updated_at' => date('Y-m-d h:m:s'),
                ]);
                return view('users.success_registr');

            }
            return redirect()->back();
        }
        Auth::guard($this->getGuard())->login($this->create($request->all()));

        return redirect($this->redirectPath());
    }
}
