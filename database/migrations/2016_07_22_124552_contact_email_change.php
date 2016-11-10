<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactEmailChange extends Migration
{
    public  function __construct()
    {
        $platform = Schema::getConnection()->getDoctrineSchemaManager()->getDatabasePlatform();
        $platform->registerDoctrineTypeMapping('enum', 'string');
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_contacts', function (Blueprint $table) {
            $table->dropForeign('user_contacts_contact_id_foreign');
        });

        Schema::table('user_contacts', function (Blueprint $table) {

//            user_contacts_contact_id_foreign
            $table->string('contact_token')->nullable()->after('contact_id');
            $table->string('contact_email')->nullable()->after('contact_token');
            $table->integer('contact_id')->unsigned()->nullable()->change();

            $table->foreign('contact_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_contacts', function (Blueprint $table) {
            $table->dropColumn('contact_token');
            $table->dropColumn('contact_email');
            $table->integer('contact_id')->unsigned()->change();
        });
    }
}
