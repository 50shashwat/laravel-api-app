<?php

namespace App\Helpers;

use Alcohol;


/**
 * Class CurrencyHelper
 *
 *
 * @method static array getAll()
 * @method static array getByAlpha3() getByAlpha3(string $alpha3)
 * @method static array getByNumeric() getByNumeric(string $number)
 *
 * @package App\Helpers
 */
class CurrencyHelper
{

    /** @var  $source Alcohol\ISO4217 */
    protected $source;

    /**
     * CurrencyHelper constructor.
     */
    public function __construct()
    {
        $this->source = new Alcohol\ISO4217();
    }

    /**
     * Call a static method
     * @param $name
     * @param $arguments
     * @return mixed
     */
    public static function __callStatic($name, $arguments)
    {
        $self = new self;

        $arg = !empty($arguments) ? $arguments[0] : '';

        return $self->source->$name($arg);
    }

    /**
     * Call a method from object
     *
     * @param $name
     * @param $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        $arg = !empty($args) ? $args[0] : '';

        return $this->source->$name($arg);
    }
}