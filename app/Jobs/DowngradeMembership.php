<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\User;
use Carbon\Carbon;

class DowngradeMembership extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels,DispatchesJobs;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $users = User::where('type',1)->get();

        foreach ($users as $user){
            if(new Carbon($user->expired_at) < Carbon::now()){
                $this->timeoutUser($user);
            }
        }
    }

    public function timeoutUser($user)
    {
        $posts = $user->posts()->orderBy('created_at', 'desc')->get();
        $regular = $user->getRegular();
        foreach ($posts as $key => $post) {
            if ($key < $regular['post']) {
                $post->access = 1;
                $this->inActive($post, $regular, true);
                $post->save();
                continue;
            }
            
            $post->active = 0;
            $this->inActive($post, $regular);
            $post->save();
        }
        $user->update(['type' => 0]);
    }

    public function inActive($post, $regular, $all = false)
    {
        $post->tags()->update(['active' => 0]);
        $post->images()->update(['active' => 0]);
        if ($all) {
            $post->tags()->orderBy('created_at', 'desc')->limit($regular['tag'])->update(['active' => 1]);
            $post->images()->orderBy('created_at', 'desc')->limit($regular['image'])->update(['active' => 1]);
        }
    }
}
