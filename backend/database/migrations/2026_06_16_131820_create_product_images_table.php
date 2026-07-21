<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id('img_id');
            $table->unsignedBigInteger('pro_id');
            $table->string('pro_img2');
            $table->string('pro_img3');
            $table->string('pro_img4');
            $table->string('pro_img5');

            $table->foreign('pro_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
