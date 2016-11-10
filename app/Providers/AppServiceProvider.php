<?php

namespace App\Providers;

use App\Helpers\CurrencyHelper;
use App\Http\Responses\ApiResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Braintree\Configuration as Braintree_Configuration;
use DB;
use Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Braintree_Configuration::environment(env('BRAINTREE_ENV'));
        Braintree_Configuration::merchantId(env('BRAINTREE_MERCHANT_ID'));
        Braintree_Configuration::publicKey(env('BRAINTREE_PUBLIC_KEY'));
        Braintree_Configuration::privateKey(env('BRAINTREE_PRIVATE_KEY'));

        DB::listen(function ($query) {
            Log::info($query->time);
            // $query->sql
            // $query->bindings
            // $query->time
        });
        $this->addCurrencyRule();
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerApiResponse();
    }

    private function registerApiResponse()
    {
        $this->app->bind('League\Fractal\Serializer\SerializerAbstract','League\Fractal\Serializer\ArraySerializer');

        $this->app->bind('App\Responses\ApiResponse', function( $app )
        {
            return new ApiResponse(
                $app['League\Fractal\Serializer\SerializerAbstract'],
                $app['Illuminate\Http\Request']
            );
        });
    }

    /**
     *  Add custom rule for currency
     */
    private function addCurrencyRule(){
        Validator::extend('currency', function ($attribute, $value, $parameters)
        {

            try{
                $result = array_merge(['status' => true], CurrencyHelper::getByAlpha3($value));
            }catch (\Exception $e){
                $result = [
                    'status' => false,
                ];
            }

            return $result['status'];
        },
            'The currency does not correspond to the ISO 4217 standard.'
        );
    }
}
