<?php

namespace App\Services;

use App\ActivityType;
use App\Events\ActivityEvent;
use App\Events\EmailNotifier;
use App\User;
use App\Post;
use App\UserMessage;

class Activity
{
    /**
     * @param User $user
     */
    public static function UserSignUpLog(User $user)
    {
        $activityType = ActivityType::whereName('register')->first();

        $activity = $activityType->activity()->create([
            'user_id' => $user->id,
            'message' => "New user " . $user->fullName() . " has signed up with email - " . $user->email,
            'ip' => \Request::ip()
        ]);

        event(new EmailNotifier('signUp'));
        event(new ActivityEvent($activity));
    }

    /**
     * @param User $user
     */
    public static function UserSignInLog(User $user)
    {
        $activityType = ActivityType::whereName('login')->first();

        $activity = $activityType->activity()->create([
            'user_id' => $user->id,
            'message' => "User " . $user->fullName() ." has signed in",
            'ip' => \Request::ip()
        ]);

        event(new ActivityEvent($activity));
    }

    /**
     * @param Post $post
     * @param User $user
     */
    public static function UserCreatedPostLog(Post $post, User $user)
    {
        $activityType = ActivityType::whereName('post')->first();

        $activity = $activityType->activity()->create([
            'user_id' => $user->id,
            'message' => $user->fullName() . " has created new post with title -" . $post->title,
            'ip' => \Request::ip()
        ]);


        event(new ActivityEvent($activity));
    }

    /**
     * @param UserMessage $message
     */
    public static function UserSendMessageLog(UserMessage $message)
    {
        $activityType = ActivityType::whereName('message')->first();

        $activity = $activityType->activity()->create([
            'user_id' => $message->sender->id,
            'message' => $message->sender->fullName() . " send message to " . $message->receiver->fullName() .
                         " with text - " . $message->message,

            'ip' => \Request::ip()
        ]);

        event(new ActivityEvent($activity));
    }


}