<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddActiveTagsPostsImages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts',function (Blueprint $table){
            $table->integer('active');
        });

        Schema::table('post_tags',function (Blueprint $table){
            $table->integer('active');
        });
        Schema::table('post_images',function (Blueprint $table){
            $table->integer('active');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts',function (Blueprint $table){
            $table->dropColumn('active');
        });

        Schema::table('post_tags',function (Blueprint $table){
            $table->dropColumn('active');
        });
        Schema::table('post_images',function (Blueprint $table){
            $table->dropColumn('active');
        });
    }
}
