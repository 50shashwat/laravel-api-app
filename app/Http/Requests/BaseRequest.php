<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Response;

class BaseRequest extends Request
{
    public function response(array $errors)
    {
        return Response::json([
            'success' => false,
            'message' => $errors
        ]);
    }
}
