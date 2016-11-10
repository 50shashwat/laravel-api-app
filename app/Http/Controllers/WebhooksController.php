<?php

namespace App\Http\Controllers;

use App\Events\EmailNotifier;
use Braintree\WebhookNotification;
use Illuminate\Http\Response;
use Log;
use Laravel\Cashier\Http\Controllers\WebhookController as BaseController;

class WebhooksController extends BaseController
{
    /**
     * Handle a subscription cancellation notification from Braintree.
     *
     * @param  WebhookNotification  $webhook
     * @return \Illuminate\Http\Response
     */
    protected function handleSubscriptionCanceled($webhook)
    {
        return $this->cancelSubscription($webhook->subscription->id);
    }

    /**
     * Handle a subscription cancellation notification from Braintree.
     *
     * @param  string  $subscriptionId
     * @return \Illuminate\Http\Response
     */
    protected function cancelSubscription($subscriptionId)
    {
        $subscription = $this->getSubscriptionById($subscriptionId);


        if ($subscription && ! $subscription->cancelled()) {
            $subscription->markAsCancelled();
        }

        event(new EmailNotifier('downgrade',$subscription->user));

        return new Response('Webhook Handled', 200);
    }
}
