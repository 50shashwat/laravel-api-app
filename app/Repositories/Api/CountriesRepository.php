<?php


namespace App\Repositories\Api;


use App\Http\Responses\ApiResponse;
use App\Services\Transformers\CountriesTransFormer;
use Cache;
use App\Country;
use \Auth;

class CountriesRepository extends BaseRepository
{
    private $transformer,$response;
    public function __construct(
        ApiResponse $apiResponse,
        CountriesTransFormer $countriesTransFormer){
        $this->response = $apiResponse;
        $this->transformer = $countriesTransFormer;
    }



    public function getCountries()
    {
        Cache::forget('countries');
        
        return Cache::rememberForever('countries', function () {
            $arrCountries = Country::all();

            $favorite = $arrCountries->whereIn('sortname', ['GB', 'US', 'DE', 'FR', 'BE']);

            $favorite->each(function ($item, $key) use ($arrCountries) {
                $arrCountries->prepend($arrCountries->pull($key));
            });

           return $this->response->collection($arrCountries,$this->transformer);
        });

    }
}