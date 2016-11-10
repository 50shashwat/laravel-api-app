<?php

namespace App\Http\Controllers\Admin;


use App\Activity;
use Carbon\Carbon;
class GraphController extends AdminBaseController
{
    public function getLogins()
    {
        return view('admin.graphs.users');
    }

    public function retrieveLogins()
    {
        $range = request('range', 1);

        $arrActivities  = Activity::whereDate('created_at', '>=',Carbon::now()->subDays($range))
                                  ->whereTypeId('1')
                                  ->get(['created_at']);

        $arrDates = [];
        foreach($arrActivities as $activity)
        {
            if(!isset($arrDates[$activity->created_at->toDateString()]))
            {
                $arrDates[$activity->created_at->toDateString()] = 1;
            }
            else {
                $arrDates[$activity->created_at->toDateString()] += 1;
            }
        }

        return $arrDates;
    }

    public function retrieveRegistrations()
    {
        $range = request('range', 1);

        $arrActivities  = Activity::whereDate('created_at', '>=',Carbon::now()->subDays($range))
            ->whereTypeId('2')
            ->get(['created_at']);

        $arrDates = [];
        foreach($arrActivities as $activity)
        {
            if(!isset($arrDates[$activity->created_at->toDateString()]))
            {
                $arrDates[$activity->created_at->toDateString()] = 1;
            }
            else {
                $arrDates[$activity->created_at->toDateString()] += 1;
            }
        }

        return $arrDates;
    }
}
