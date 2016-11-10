<?php

namespace App\Http\Controllers\Api;

use App\Helpers\CurrencyHelper;
use App\Http\Controllers\Controller;
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
            $currencies = CurrencyHelper::getAll();
            $order = [
                'GBP' => 0,
                'USD' => 1,
                'EUR' => 2
            ];
            $bubble = null;

            /*
             * Old Code
             * Get all currencies
             * */
            foreach ($currencies as $key => $currency) {
                if (isset($order[$currency['alpha3']])) {
                    $position = $order[$currency['alpha3']];
                    $bubble = $currencies[$position];
                    $currencies[$position] = $currency;
                    $currencies[$key] = $bubble;
                }
            }

            $response = [
                'success' => true,
                'code' => 200,
                'data' => array_slice($currencies, 0, 3)
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
