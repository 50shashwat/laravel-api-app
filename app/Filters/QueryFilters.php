<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class QueryFilters
{
    /**
     * The request object
     *
     * @var Request
     */
    protected $request;

    /**
     * The builder instance
     *
     * @var
     */
    protected $builder;

    /**
     * Create a new QueryFilters instance
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply the filters to the builder instance
     *
     * @param Builder $builder
     * @return Builder
     */
    public function apply(Builder $builder)
    {
        $this->builder = $builder;
        
        foreach ($this->filters() as $name => $value)
        {
            if(! method_exists($this,$name))
            {
                continue;
            }
            
            (strlen($value)) ? $this->$name($value) : $this->$name();
        }
        
        return $this->builder;
    }

    /**
     * Get all request params (filters)
     * 
     * @return array
     */
    public function filters()
    {
        return $this->request->all();
    }
}