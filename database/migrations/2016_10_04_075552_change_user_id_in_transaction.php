<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeUserIdInTransaction extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions',function (Blueprint $table){
            $table->dropForeign('transactions_user_id_foreign');
        });
        Schema::table('transactions',function (Blueprint $table){
            $table->dropColumn('user_id');
        });

        Schema::table('transactions',function (Blueprint $table){
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')
                ->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transactions',function (Blueprint $table){
            $table->dropForeign('transactions_user_id_foreign');
        });

        Schema::table('transactions',function (Blueprint $table){
            $table->dropColumn('user_id');
        });

        Schema::table('transactions',function (Blueprint $table){
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')
                ->references('id')->on('users');
        });
    }
}
