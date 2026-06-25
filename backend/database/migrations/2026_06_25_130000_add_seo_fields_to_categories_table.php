<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'handle')) {
                $table->string('handle')->nullable()->after('cat_img');
            }
            if (!Schema::hasColumn('categories', 'SEOtitle')) {
                $table->string('SEOtitle')->nullable()->after('handle');
            }
            if (!Schema::hasColumn('categories', 'SEOdescription')) {
                $table->string('SEOdescription')->nullable()->after('SEOtitle');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['handle', 'SEOtitle', 'SEOdescription']);
        });
    }
};
