<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
use \Auth;

class PremiumMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(User::TYPE_PREMIUM == Auth::type){
            dd(User::TYPE_PREMIUM);
        }
        dd(User::TYPE_PREMIUM);
        return $next($request);
    }
}
