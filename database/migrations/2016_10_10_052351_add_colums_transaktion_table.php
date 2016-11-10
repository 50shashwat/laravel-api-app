<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumsTransaktionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions',function (Blueprint $table){
            $table->string('expires_date');
            $table->string('expires_date_ms');
            $table->string('expires_date_pst');
            $table->string('web_order_line_item_id');
            $table->boolean('is_trial_period');
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
            $table->dropColumn('expires_date');
            $table->dropColumn('expires_date_ms');
            $table->dropColumn('expires_date_pst');
            $table->dropColumn('web_order_line_item_id');
            $table->dropColumn('is_trial_period');
        });
    }
}
