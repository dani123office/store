<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_colors', function (Blueprint $table) {
            $table->id('color_id');
            $table->unsignedBigInteger('pro_id');
            $table->string('color1');
            $table->string('color2');
            $table->string('color3');
            $table->string('color4');
            $table->string('color5');
            $table->string('color6');

            $table->foreign('pro_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_colors');
    }
};
