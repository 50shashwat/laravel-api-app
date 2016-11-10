<?php

namespace App\Listeners;

use App\Events\ActivityEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ActivityEventListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ActivityEvent  $event
     * @return void
     */
    public function handle(ActivityEvent $event)
    {
        //
    }
}
