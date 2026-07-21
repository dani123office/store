<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('o_timelines', function (Blueprint $table) {
            $table->id();
            $table->integer('o_id');
            $table->integer('u_id');
            $table->string('comment', 1024);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('o_timelines');
    }
};
