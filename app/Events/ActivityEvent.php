<?php

namespace App\Events;

use App\Activity;
use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ActivityEvent extends Event implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * Partial view that needs to be rendered
     *
     * @var string
     */
    public $partial;

    /**
     * Type of event that fired
     *
     * @var string
     */
    public $type;

    /**
     * Create a new event instance.
     *
     * @param Activity $activity
     */
    public function __construct(Activity $activity)
    {
        $this->partial = $this->rendActivity($activity);
        $this->type    = strtoupper($activity->type->name);
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['activity_channel'];
    }

    /**
     * Get the broadcast event name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'activity_event';
    }

    /**
     * Create the view that are going to be appended
     *
     * @param $activity
     * @return string
     * @throws \Exception
     * @throws \Throwable
     */
    private function rendActivity($activity)
    {
        $isNew = true;
        return view('admin.activity._activities',compact('activity','isNew'))->render();
    }

}
