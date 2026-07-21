<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taxes', function (Blueprint $table) {
            $table->id();
            $table->string('digital', 1024);
            $table->string('food', 1024);
            $table->string('nonfood', 1024);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxes');
    }
};
