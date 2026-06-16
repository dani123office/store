<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_logins', function (Blueprint $table) {
            $table->id();
            $table->string('email', 32);
            $table->string('password');
            $table->string('f_name');
            $table->string('l_name');
            $table->boolean('OrderPage');
            $table->boolean('ProductPage');
            $table->boolean('OrderDetailsPage');
            $table->boolean('AddProductPage');
            $table->boolean('UpdateProductPage');
            $table->boolean('CategoryPage');
            $table->boolean('AddCategoryPage');
            $table->boolean('UpdateCategoryPage');
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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_logins');
    }
};
