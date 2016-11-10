<?php
/**
 * Created by PhpStorm.
 * User: Lennakan
 * Date: 19.10.2016
 * Time: 16:22
 */

namespace App\Helpers;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class Quickblox
{
    private static $client;

    public static function registerUser($data)
    {
        self::$client = new Client();
        $password = md5(time());
        try{
            $response = json_decode(self::$client->post('http://api.quickblox.com/users.json?token='.self::auth(), [
                'json'=>[
                    'user'=>[
                        'email' => $data['email'],
                        'login' => $data['login'],
                        'password' => $password
                    ]
                ]
            ])->getBody())->user;
        }catch (\Exception $e){
            return [
                'error'=>['code'    =>$e->getCode()]
            ];
        }
        $response->password = $password;

        return $response;
    }

    public static function loginUser($data)
    {
        self::$client = new Client();

        try{

            return json_decode(self::$client->post('http://api.quickblox.com/login.json?token='.self::auth(), [
                'json'=>[
                    'email' => $data['email'],
                    'password' => $data['password']
                ]
            ])->getBody())->user;
        }catch (\Exception $e){
            
            return [
                'error'=>['code'    =>$e->getCode()]
            ];
        }

    }

    public static function signature($nonce,$timestamp)
    {
        $stringForSignature = "application_id=".env('QUICKBLOK_APP_ID')."&auth_key=".env('QUICKBLOK_AUTH_KEY')."&nonce=".$nonce."&timestamp=".$timestamp;

        return hash_hmac( 'sha1', $stringForSignature , env('QUICKBLOK_AUTH_SECRET'));
    }

    public static function auth()
    {
        if (Cache::has('QuickBloxToken')) {

            return Cache::get('QuickBloxToken');
        }
        $timestamp = date_create()->getTimestamp();
        $nonce = bcrypt($timestamp);
        try{
            $response = json_decode(self::$client->post('http://api.quickblox.com/session.json', [
                'json'=>[
                    'application_id' => (String) env('QUICKBLOK_APP_ID'),
                    'auth_key'       => (String) env('QUICKBLOK_AUTH_KEY'),
                    'timestamp'      => (String) $timestamp,
                    'nonce'          => (String) $nonce,
                    'signature'      => (String) self::signature($nonce,$timestamp),
                ]])->getBody());
            Cache::put('QuickBloxToken', $response->session->token, 9);
        }catch (\Exception $e){
            if($e->getCode() == 422){

                return self::auth();
            }
        }

        return $response->session->token;
    }
}