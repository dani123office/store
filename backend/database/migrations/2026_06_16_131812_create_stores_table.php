<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('StoreName', 1024);
            $table->string('StoreEmail', 1024);
            $table->string('SenderEmail', 1024);
            $table->string('StoreIndustry', 1024);
            $table->string('LegalName', 1024);
            $table->string('Phone', 1024);
            $table->string('Streets', 1024);
            $table->string('Apartment', 1024);
            $table->string('City', 1024);
            $table->string('ZipCode', 1024);
            $table->string('Country', 1024);
            $table->string('TimeZone', 1024);
            $table->string('UnitSystem', 1024);
            $table->string('WeightUnit', 1024);
            $table->string('Currency', 1024);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
