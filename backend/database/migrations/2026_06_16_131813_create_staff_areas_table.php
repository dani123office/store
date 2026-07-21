<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_areas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('OrderPage');
            $table->boolean('ProductPage');
            $table->boolean('OrderDetailsPage');
            $table->boolean('AddProductPage');
            $table->boolean('UpdateProductPage');
            $table->boolean('CategoryPage');
            $table->boolean('AddCategory');
            $table->boolean('UpdateCategory');
            $table->boolean('CustomerPage');
            $table->boolean('AboutCustomerPage');
            $table->boolean('SubcategoryPage');
            $table->boolean('AddSubcategoryPage');
            $table->boolean('UpdateSubcategoryPage');
            $table->boolean('CollectionPage');
            $table->boolean('AddCollectionPage');
            $table->boolean('UpdateCollectionPage');
            $table->boolean('SettingsPage');
            $table->boolean('GeneralPage');
            $table->boolean('StaffAccountPage');
            $table->boolean('StaffAreaPage');
            $table->boolean('UpdateStaffAreaPage');
            $table->boolean('TaxPage');
            $table->boolean('PaymentPage');
            $table->boolean('NotificationPage');
            $table->boolean('TranslationPage');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_areas');
    }
};
