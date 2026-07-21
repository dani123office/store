<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('StoreName', 1024)->nullable()->change();
            $table->string('StoreEmail', 1024)->nullable()->change();
            $table->string('SenderEmail', 1024)->nullable()->change();
            $table->string('StoreIndustry', 1024)->nullable()->change();
            $table->string('LegalName', 1024)->nullable()->change();
            $table->string('Phone', 1024)->nullable()->change();
            $table->string('Streets', 1024)->nullable()->change();
            $table->string('Apartment', 1024)->nullable()->change();
            $table->string('City', 1024)->nullable()->change();
            $table->string('ZipCode', 1024)->nullable()->change();
            $table->string('Country', 1024)->nullable()->change();
            $table->string('TimeZone', 1024)->nullable()->change();
            $table->string('UnitSystem', 1024)->nullable()->change();
            $table->string('WeightUnit', 1024)->nullable()->change();
            $table->string('Currency', 1024)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('StoreName', 1024)->nullable(false)->change();
            $table->string('StoreEmail', 1024)->nullable(false)->change();
            $table->string('SenderEmail', 1024)->nullable(false)->change();
            $table->string('StoreIndustry', 1024)->nullable(false)->change();
            $table->string('LegalName', 1024)->nullable(false)->change();
            $table->string('Phone', 1024)->nullable(false)->change();
            $table->string('Streets', 1024)->nullable(false)->change();
            $table->string('Apartment', 1024)->nullable(false)->change();
            $table->string('City', 1024)->nullable(false)->change();
            $table->string('ZipCode', 1024)->nullable(false)->change();
            $table->string('Country', 1024)->nullable(false)->change();
            $table->string('TimeZone', 1024)->nullable(false)->change();
            $table->string('UnitSystem', 1024)->nullable(false)->change();
            $table->string('WeightUnit', 1024)->nullable(false)->change();
            $table->string('Currency', 1024)->nullable(false)->change();
        });
    }
};
