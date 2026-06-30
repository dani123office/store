<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->integer('fb_connected')->default(0);
            $table->text('fb_access_token')->nullable();
            $table->string('fb_business_manager', 1024)->nullable();
            $table->string('fb_ad_account', 1024)->nullable();
            $table->string('fb_page', 1024)->nullable();
            $table->string('fb_pixel_id', 1024)->nullable();
            $table->string('fb_data_sharing', 1024)->default('Maximum');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'fb_connected',
                'fb_access_token',
                'fb_business_manager',
                'fb_ad_account',
                'fb_page',
                'fb_pixel_id',
                'fb_data_sharing',
            ]);
        });
    }
};
