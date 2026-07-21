<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Optimize products table
        Schema::table('products', function (Blueprint $table) {
            // Add SKU column if it doesn't exist
            if (!Schema::hasColumn('products', 'sku')) {
                $table->string('sku')->nullable()->unique()->after('title');
            }
            
            // Add indexes for relations
            $table->index('category_id');
            $table->index('subcategory_id');
            
            // Add soft deletes support
            if (!Schema::hasColumn('products', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 2. Optimize orders table
        // Drops existing foreign key and recreates with onDelete('set null') to preserve historical order logs
        Schema::table('orders', function (Blueprint $table) {
            // Check if foreign key exists and drop it safely
            try {
                $table->dropForeign(['user_id']);
            } catch (\Exception $e) {
                // Ignore if not supported or not present
            }

            // Re-establish foreign key with safe cascading rules
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');

            // Add index for orderStatus and user_id (for fast filtering)
            $table->index('orderStatus');
            $table->index('user_id');

            // Add soft deletes support
            if (!Schema::hasColumn('orders', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // 3. Optimize users table
        Schema::table('users', function (Blueprint $table) {
            // Add index on email for faster auth querying (already unique in Laravel default, but good to ensure)
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sku');
            $table->dropIndex(['category_id']);
            $table->dropIndex(['subcategory_id']);
            $table->dropSoftDeletes();
        });

        Schema::table('orders', function (Blueprint $table) {
            try {
                $table->dropForeign(['user_id']);
            } catch (\Exception $e) {}
            
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->dropIndex(['orderStatus']);
            $table->dropIndex(['user_id']);
            $table->dropSoftDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
        });
    }
};
