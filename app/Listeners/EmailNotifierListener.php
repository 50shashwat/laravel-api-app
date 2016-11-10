<?php

namespace App\Listeners;

use App\Events\EmailNotifier;
use Illuminate\Support\Facades\Mail;

class EmailNotifierListener
{
    /**
     * @var
     */
    protected $message;

    /**
     * @var
     */
    protected $subject;

    /**
     * @var
     */
    protected $user;

    /**
     * Handle the event.
     *
     * @param  EmailNotifier  $event
     * @return void
     */
    public function handle(EmailNotifier $event)
    {

        $method = 'get' . ucfirst($event->type) . 'Message';
        $this->user = $event->user;
        $this->message = $this->$method();

        $this->sendNotificationEmail();
    }

    /**
     * Get email body for sign up
     *
     * @return string
     */
    public function getSignUpMessage()
    {
        $this->subject = 'User sign up';

        return 'New user has signed up';
    }

    /**
     * Get email body for password reminder
     *
     * @return string
     */
    public function getPasswordReminderMessage()
    {
        $this->subject = 'User password reminder';

        return 'New password reminder request has been sent';
    }

    /**
     * Get email body for downgrade from pro plan
     *
     * @return string
     */
    public function getDowngradeMessage()
    {
        $this->subject = 'User canceled subscription';

        return "User with email address - {$this->user->email} just canceled the subscription";
    }

    /**
     * Get email body for upgrade to pro plan
     *
     * @return string
     */
    public function getUpgradeMessage()
    {
        $this->subject = 'User subscribed';

        return "User with email address - {$this->user->email} just subscribed to pro plan";
    }

    /**
     * Send the notification email to support
     *
     */
    protected function sendNotificationEmail()
    {
        Mail::raw($this->message, function($m)
        {
            $m->to(env('SUPPORT_MAIL'));
            $m->subject($this->subject);
        });
    }
}
