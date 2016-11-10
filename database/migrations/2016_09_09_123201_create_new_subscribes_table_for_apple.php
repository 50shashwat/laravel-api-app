<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewSubscribesTableForApple extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('subscriptions');
        Schema::drop('transactions');

        Schema::create('transactions',function (Blueprint $table){
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('original_purchase_date_pst');
            $table->string('original_transaction_id');
            $table->string('original_purchase_date_ms');
            $table->string('transaction_id');
            $table->string('quantity');
            $table->string('product_id');
            $table->string('bvrs');
            $table->string('purchase_date_ms');
            $table->string('purchase_date');
            $table->string('original_purchase_date');
            $table->string('purchase_date_pst');
            $table->string('bid');
            $table->string('item_id');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('transactions');
        Schema::create('subscriptions',function (Blueprint $table){
            $table->increments('id');
        });
        Schema::create('transactions',function (Blueprint $table){
            $table->increments('id');
        });

    }
}
