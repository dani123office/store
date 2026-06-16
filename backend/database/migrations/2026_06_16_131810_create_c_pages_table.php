<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('c_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title', 1024)->nullable();
            $table->string('description', 1024)->nullable();
            $table->string('SEOtitle', 1024)->nullable();
            $table->string('SEOdescription', 1024)->nullable();
            $table->string('SEOurl', 1024)->nullable();
            $table->integer('visibility')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('c_pages');
    }
};
