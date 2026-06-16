<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pro_id');
            $table->unsignedBigInteger('user_id');
            $table->string('product_title');
            $table->string('product_image')->nullable();
            $table->string('product_size')->nullable();
            $table->string('product_color')->nullable();
            $table->float('product_price')->default(0);
            $table->integer('quantity')->default(0);
            $table->float('total')->default(0);
            $table->timestamps();

            $table->foreign('pro_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
