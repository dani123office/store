<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image')->nullable();
            $table->string('handle')->nullable();
            $table->string('SEOdescription')->nullable();
            $table->string('SEOtitle')->nullable();
            $table->unsignedBigInteger('cat_id')->nullable();
            $table->timestamps();

            $table->foreign('cat_id')->references('cat_id')->on('categories')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
