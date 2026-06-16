<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('link');
            $table->unsignedBigInteger('parent')->default(0);
            $table->integer('sort')->default(0);
            $table->string('class')->nullable();
            $table->unsignedBigInteger('menu');
            $table->integer('depth')->default(0);
            $table->timestamps();
            $table->integer('role_id')->default(0);

            $table->foreign('menu')->references('id')->on('admin_menus')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_menu_items');
    }
};
