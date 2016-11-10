<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportCountries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:countries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import all countries with states and cities';

    /**
     * Create a new command instance.
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $config = 'database.connections.mysql.';

        exec("mysql -u " . config($config . 'username') . " -p " . config($config . 'database') . " < " . storage_path('sqls/countries.sql'));
        exec("mysql -u " . config($config . 'username') . " -p " . config($config . 'database') . " < " . storage_path('sqls/states.sql'));
        exec("mysql -u " . config($config . 'username') . " -p " . config($config . 'database') . " < " . storage_path('sqls/cities.sql'));
    }
}
