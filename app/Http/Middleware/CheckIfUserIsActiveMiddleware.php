<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckIfUserIsActiveMiddleware
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
        if(!JWTAuth::parseToken()->authenticate()->active)
        {
            return response()->json([
                'code' => 400,
                'not_active' => true,
                'message'      => 'Please activate your account',
                'reset_link' => route('api.email.reset')
            ]);
        }

        return $next($request);

    }
}
