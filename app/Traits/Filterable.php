<?php

namespace App\Traits;

use App\Filters\QueryFilters;
use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    /**
     * Filter a result by given params
     * 
     * @param Builder $query
     * @param QueryFilters $filters
     * @return mixed
     */
    public function scopeFilter($query, QueryFilters $filters)
    {
        return $filters->apply($query);
    }
}