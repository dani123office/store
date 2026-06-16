<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cat_items', function (Blueprint $table) {
            $table->id('cat_item_id');
            $table->unsignedBigInteger('subcat_id');
            $table->string('cat_item_title');
            $table->string('cat_item_img')->nullable();
            $table->string('SEOdescription')->nullable();
            $table->string('SEOtitle')->nullable();
            $table->string('handle')->nullable();
            $table->timestamps();

            $table->foreign('subcat_id')->references('subcat_id')->on('sub_categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cat_items');
    }
};
