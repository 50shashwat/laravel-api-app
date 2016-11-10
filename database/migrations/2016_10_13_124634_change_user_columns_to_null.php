<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeUserColumnsToNull extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users',function (Blueprint $table){
            $table->string('country')->nullable()->change();
            $table->string('company_name')->nullable()->change();
            $table->string('biography')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users',function (Blueprint $table){
            $table->string('country')->nullable(false)->change();
            $table->string('company_name')->nullable(false)->change();
            $table->string('biography')->nullable(false)->change();
        });
    }
}
