<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id('size_id');
            $table->unsignedBigInteger('pro_id');
            $table->string('size1');
            $table->string('size2');
            $table->string('size3');
            $table->string('size4');
            $table->string('size5');
            $table->string('size6');

            $table->foreign('pro_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};
