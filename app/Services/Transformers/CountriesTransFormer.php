<?php

namespace App\Services\Transformers;


use App\Country;
use League\Fractal\TransformerAbstract;

class CountriesTransFormer extends TransformerAbstract
{
    /**
     * @param Country $country
     * @return array
     */
    public function transform(Country $country)
    {
        return [
            'country_code' => $country->sortname,
            'country_name' => $country->name
             ];
    }

}