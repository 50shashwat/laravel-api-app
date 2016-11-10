<?php

namespace App\Events;

class EmailNotifier extends Event
{

    /**
     * Type of the email that should be sent
     * @var
     */
    public $type;

    /**
     * @var null
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param $type
     * @param null $user
     */
    public function __construct($type,$user = null)
    {
        $this->type = $type;

        $this->user = $user;
    }

}
