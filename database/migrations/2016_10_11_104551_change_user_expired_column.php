<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeUserExpiredColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users',function (Blueprint $table){
            $table->dropColumn('expired_at');
        });

        Schema::table('users',function (Blueprint $table){
            $table->string('expired_at');
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
            $table->dropColumn('expired_at');
        });
        Schema::table('users',function (Blueprint $table){
            $table->date('expired_at');
        });
    }
}
