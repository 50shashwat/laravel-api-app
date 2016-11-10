<?php

use App\ActivityType;
use Illuminate\Database\Seeder;

class ActivityTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arrTypes = ['login', 'register', 'post', 'message'];

        foreach ($arrTypes as $type)
        {
            ActivityType::create(['name' => $type]);
        }
    }
}
