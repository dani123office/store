<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->decimal('ShippingFee', 10, 2)->nullable()->default(500);
            $table->decimal('FreeShippingThreshold', 10, 2)->nullable()->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['ShippingFee', 'FreeShippingThreshold']);
        });
    }
};
