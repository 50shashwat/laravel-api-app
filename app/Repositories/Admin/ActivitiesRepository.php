<?php

namespace App\Repositories\Admin;


use App\Activity;
use App\ActivityType;

class ActivitiesRepository
{
    /**
     * @var Activity
     */
    protected $activity;

    /**
     * ActivitiesRepository constructor.
     * @param Activity $activity
     */
    public function __construct(Activity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get all activities where type is user
     *
     * @return array
     */
    public function getLoginsActivity()
    {
        $activityType = $this->getActivities('login');

        return compact('activityType');
    }

    /**
     * Get all activities where type is user
     *
     * @return array
     */
    public function getRegistrationsActivity()
    {
        $activityType = $this->getActivities('register');

        return compact('activityType');
    }

    /**
     * Get all activities where type is post
     *
     * @return array
     */
    public function getPostsActivity()
    {
        $activityType = $this->getActivities('post');

        return compact('activityType');
    }

    /**
     * Get all activities where type is message
     *
     * @return array
     */
    public function getMessagesActivity()
    {
        $activityType = $this->getActivities('message');

        return compact('activityType');
    }

    /**
     * Get activities by type
     *
     * @param $type
     * @return mixed
     */
    private function getActivities($type)
    {
        return ActivityType::with('activity.user')->whereName($type)->first();
    }
}