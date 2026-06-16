<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emarkets', function (Blueprint $table) {
            $table->id();
            $table->string('email', 1024);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emarkets');
    }
};
