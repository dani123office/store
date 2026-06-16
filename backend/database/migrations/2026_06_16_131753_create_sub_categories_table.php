<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id('subcat_id');
            $table->unsignedBigInteger('cat_id');
            $table->string('subcat_title');
            $table->string('subcat_img')->nullable();
            $table->string('handle')->nullable();
            $table->string('SEOdescription')->nullable();
            $table->string('SEOtitle')->nullable();
            $table->timestamps();

            $table->foreign('cat_id')->references('cat_id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_categories');
    }
};
