<?php

use Illuminate\Database\Seeder;

class AlertTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arrTypes = [
            ['name' => 'asap'],
            ['name' => 'once_a_day'],
            ['name' => 'once_a_week'],
            ['name' => 'never']
        ];
        
        foreach ($arrTypes as $type)
        {
            \App\AlertType::create($type);
        }
    }
}
