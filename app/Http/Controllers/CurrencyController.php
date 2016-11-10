<?php

namespace App\Http\Controllers;

use App\Helpers\CurrencyHelper;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Alcohol;
use App\Http\Requests;

class CurrencyController extends Controller
{

    /**
     * Get all currencies ISO 4127
     *
     * @TODO There may be a need to create a new repository in Repositories/Api and call the response via it.
     */
    public function getAll(){
        try{
            $result = CurrencyHelper::getAll();
            $response = [
                'success' => true,
                'code' => 200,
                'data' => $result
            ];
        }catch (\Exception $e){
            $response = [
                'success' => false,
                'error' => [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage()
                ]
            ];
        }
        return response()->json($response);
    }
}
