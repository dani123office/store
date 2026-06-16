<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_widths', function (Blueprint $table) {
            $table->id('width_id');
            $table->unsignedBigInteger('pro_id');
            $table->string('width1');
            $table->string('width2');
            $table->string('width3');

            $table->foreign('pro_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_widths');
    }
};
