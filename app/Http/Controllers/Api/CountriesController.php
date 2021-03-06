<?php

namespace App\Http\Controllers\Api;

use App\Country;
use App\State;
use Cache;
use App\Http\Controllers\Controller;
use App\Repositories\Api\CountriesRepository;

use App\Http\Requests;

class CountriesController extends Controller
{
    private $repository;

    public function __construct(CountriesRepository $repository)
    {
        $this->repository = $repository;

    }

    /**
     * Get all countries with custom order
     *
     * @return mixed
     */
    public function getAllCountries()
    {
        return $this->repository->getCountries();
    }

    /**
     * Get all states for country by country's sortname
     *
     * @param $country
     * @return mixed
     */
    public function getStatesForCountry($country)
    {
        return Cache::rememberForever('states-' . $country, function() use ($country) {
            $objCountry = Country::where('sortname',$country)->with('states')->first();

            return response()->json($objCountry->states->pluck('name','id')->toArray());
        });
    }

    /**
     * Get all cities for state
     *
     * @param State $state
     * @return mixed
     */
    public function getCitiesForStates(State $state)
    {
        return Cache::rememberForever('cities-' . $state->id, function() use ($state) {
            $state->load('cities');

            return response()->json($state->cities->pluck('name','id')->toArray());
        });
    }
}
