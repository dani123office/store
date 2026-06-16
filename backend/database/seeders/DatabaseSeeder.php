<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\CatItem;
use App\Models\AdminLogin;
use App\Models\Role;
use App\Models\CPage;
use App\Models\Notification;
use App\Models\Store;
use App\Models\Tax;
use App\Models\Emarket;
use App\Models\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Products from db.json
        $products = [
            ['title' => 'Luxury Dress', 'image' => 'product image 1.jpg', 'category' => 'special-edition', 'price' => 3500, 'popularity' => 5, 'stock' => 10],
            ['title' => 'Luxury Black Clothing', 'image' => 'product image 2.jpg', 'category' => 'luxury-collection', 'price' => 1050, 'popularity' => 4, 'stock' => 20],
            ['title' => 'Luxury Blue Dress', 'image' => 'product image 3.jpg', 'category' => 'summer-edition', 'price' => 5000, 'popularity' => 3, 'stock' => 5],
            ['title' => 'Special Brown Dress', 'image' => 'product image 4.jpg', 'category' => 'unique-collection', 'price' => 2500, 'popularity' => 2, 'stock' => 15],
            ['title' => 'Special Luxury Dress', 'image' => 'product image 5.jpg', 'category' => 'unique-collection', 'price' => 5200, 'popularity' => 1, 'stock' => 0],
            ['title' => 'Super Luxury Dress', 'image' => 'product image 6.jpg', 'category' => 'luxury-collection', 'price' => 8500, 'popularity' => 20, 'stock' => 20],
            ['title' => 'Luxury Brown Dress', 'image' => 'product image 7.jpg', 'category' => 'luxury-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Premium Brown Dress', 'image' => 'product image 8.jpg', 'category' => 'unique-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Luxury White Dress', 'image' => 'product image 9.jpg', 'category' => 'luxury-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Brown Limited Collection', 'image' => 'product image 10.jpg', 'category' => 'unique-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Golden Premium T-shirt', 'image' => 'product image 11.jpg', 'category' => 'luxury-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Golden T-shirt', 'image' => 'product image 12.jpg', 'category' => 'summer-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'White Premium T-shirt', 'image' => 'product image 13.jpg', 'category' => 'special-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Brown Premium T-shirt', 'image' => 'product image 14.jpg', 'category' => 'special-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Brown Special Clothing', 'image' => 'product image 15.jpg', 'category' => 'special-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'White Special Clothing', 'image' => 'product image 16.jpg', 'category' => 'special-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Dark Special Clothing', 'image' => 'product image 17.jpg', 'category' => 'special-edition', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
            ['title' => 'Brown Premium Clothing', 'image' => 'product image 18.jpg', 'category' => 'unique-collection', 'price' => 4500, 'popularity' => 5, 'stock' => 500],
        ];
        foreach ($products as $p) {
            Product::create($p);
        }

        // Users from db.json (with hashed passwords)
        $users = [
            ['name' => 'Aleksandar', 'lastname' => 'Kuzmanovic', 'email' => 'aleksandarkuzmanovic021@gmail.com', 'password' => Hash::make('1233214321'), 'role' => 'customer'],
            ['name' => 'Bojan', 'lastname' => 'Cesnak', 'email' => 'bc22@gmail.com', 'password' => Hash::make('123321'), 'role' => 'customer'],
            ['name' => 'A', 'lastname' => 'A', 'email' => 'a@gmail.com', 'password' => Hash::make('123321'), 'role' => 'customer'],
            ['name' => 'Lebron', 'lastname' => 'James', 'email' => 'lebronjames@gmail.com', 'password' => Hash::make('1233214321'), 'role' => 'customer'],
            ['name' => 'Admin', 'lastname' => 'User', 'email' => 'admin@admin.com', 'password' => Hash::make('admin123'), 'role' => 'admin'],
        ];
        foreach ($users as $u) {
            User::create($u);
        }

        // Orders from db.json
        $orderData = [
            ['user_id' => 2, 'data' => json_encode(["emailAddress" => "bc22@gmail.com","firstName" => "Bojan","lastName" => "Cesnak","company" => "BC","address" => "B2","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "Serbia","postalCode" => "11080","phone" => "06123123132","paymentType" => "on","cardNumber" => "12313212","nameOnCard" => "123123","expirationDate" => "123123","cvc" => "12312"]), 'products' => json_encode([["id" => "2xsblack","image" => "product image 2.jpg","title" => "Luxury Black Clothing","category" => "luxury-collection","price" => 1050,"quantity" => 3,"size" => "xs","color" => "black","popularity" => 4,"stock" => 20]]), 'subtotal' => 3150, 'orderStatus' => 'Processing', 'orderDate' => null],
            ['user_id' => 2, 'data' => json_encode(["emailAddress" => "bc22@gmail.com","firstName" => "Bojan","lastName" => "Cesnak","company" => "asd","address" => "asd","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "123","postalCode" => "123","phone" => "123","paymentType" => "on","cardNumber" => "123","nameOnCard" => "123","expirationDate" => "123","cvc" => "123"]), 'products' => json_encode([["id" => "2xlblack","image" => "product image 2.jpg","title" => "Luxury Black Clothing","category" => "luxury-collection","price" => 1050,"quantity" => 3,"size" => "xl","color" => "black","popularity" => 4,"stock" => 20]]), 'subtotal' => 3150, 'orderStatus' => 'Processing', 'orderDate' => '2024-08-31T06:54:38.482Z'],
            ['user_id' => 1, 'data' => json_encode(["emailAddress" => "a@gmail.com","firstName" => "Aca","lastName" => "Kuzma","company" => "Bojan Cesnak","address" => "Marka Markovic 22","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "Serbia","postalCode" => "11080","phone" => "06123123132","paymentType" => "on","cardNumber" => "123","nameOnCard" => "123","expirationDate" => "123","cvc" => "123"]), 'products' => json_encode([["id" => "1xlblack","image" => "product image 1.jpg","title" => "Luxury Dress","category" => "special-edition","price" => 3500,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 5,"stock" => 10],["id" => "4xlblack","image" => "product image 4.jpg","title" => "Special Brown Dress","category" => "unique-collection","price" => 2500,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 2,"stock" => 15]]), 'subtotal' => 6000, 'orderStatus' => 'Processing', 'orderDate' => '2024-08-31T07:01:32.959Z'],
            ['user_id' => 1, 'data' => json_encode(["emailAddress" => "a@gmail.com","firstName" => "Aca","lastName" => "Kuzma","company" => "123","address" => "123","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "Serbia","postalCode" => "11080","phone" => "123","paymentType" => "on","cardNumber" => "123","nameOnCard" => "123","expirationDate" => "123","cvc" => "123"]), 'products' => json_encode([["id" => "1xlblack","image" => "product image 1.jpg","title" => "Luxury Dress","category" => "special-edition","price" => 3500,"quantity" => 2,"size" => "xl","color" => "black","popularity" => 5,"stock" => 10]]), 'subtotal' => 7000, 'orderStatus' => 'Processing', 'orderDate' => '2024-08-31T07:07:37.188Z'],
            ['user_id' => 2, 'data' => json_encode(["emailAddress" => "bc22@gmail.com","firstName" => "Bojan","lastName" => "Cesnak","company" => "Bojan Cesnak","address" => "Marka Markovic 22","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "Serbia","postalCode" => "11080","phone" => "06123123132","paymentType" => "on","cardNumber" => "123","nameOnCard" => "123","expirationDate" => "123","cvc" => "123"]), 'products' => json_encode([["id" => "6xlblack","image" => "product image 6.jpg","title" => "Super Luxury Dress","category" => "luxury-collection","price" => 8500,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 20,"stock" => 20],["id" => "5xlblack","image" => "product image 5.jpg","title" => "Special Luxury Dress","category" => "unique-collection","price" => 5200,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 1,"stock" => 0],["id" => "4xlblack","image" => "product image 4.jpg","title" => "Special Brown Dress","category" => "unique-collection","price" => 2500,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 2,"stock" => 15],["id" => "3xlblack","image" => "product image 3.jpg","title" => "Luxury Blue Dress","category" => "summer-edition","price" => 5000,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 3,"stock" => 5],["id" => "2xlblack","image" => "product image 2.jpg","title" => "Luxury Black Clothing","category" => "luxury-collection","price" => 1050,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 4,"stock" => 20],["id" => "1xlblack","image" => "product image 1.jpg","title" => "Luxury Dress","category" => "special-edition","price" => 3500,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 5,"stock" => 10]]), 'subtotal' => 25750, 'orderStatus' => 'Processing', 'orderDate' => '2024-08-31T07:12:42.805Z'],
            ['user_id' => 3, 'data' => json_encode(["emailAddress" => "a@gmail.com","firstName" => "Aca","lastName" => "Cesnak","company" => "Bojan Cesnak","address" => "Marka Markovic 22","apartment" => "123","city" => "Belgrade","country" => "United States","region" => "Serbia","postalCode" => "11080","phone" => "06123123132","paymentType" => "on","cardNumber" => "123","nameOnCard" => "321","expirationDate" => "123","cvc" => "321"]), 'products' => json_encode([["id" => "2xlblack","image" => "product image 2.jpg","title" => "Luxury Black Clothing","category" => "luxury-collection","price" => 1050,"quantity" => 1,"size" => "xl","color" => "black","popularity" => 4,"stock" => 20]]), 'subtotal' => 1050, 'orderStatus' => 'Processing', 'orderDate' => '8/31/2024'],
            ['user_id' => 4, 'data' => json_encode(["emailAddress" => "lebronjames@gmail.com","firstName" => "Lebron","lastName" => "James","company" => "NBA","address" => "NBA Street","apartment" => "212","city" => "Cleveland","country" => "United States","region" => "USA","postalCode" => "1123012","phone" => "123123","paymentType" => "on","cardNumber" => "123","nameOnCard" => "123","expirationDate" => "123","cvc" => "123"]), 'products' => json_encode([["id" => "2smblue","image" => "product image 2.jpg","title" => "Luxury Black Clothing","category" => "luxury-collection","price" => 1050,"quantity" => 3,"size" => "sm","color" => "blue","popularity" => 4,"stock" => 20]]), 'subtotal' => 3150, 'orderStatus' => 'Processing', 'orderDate' => '2024-08-31T09:54:07.549Z'],
        ];
        foreach ($orderData as $o) {
            Order::create($o);
        }

        // Categories from zappos.sql
        Category::create(['cat_title' => 'Men', 'cat_img' => '1.jpg']);
        Category::create(['cat_title' => 'Women', 'cat_img' => '1.jpg']);
        Category::create(['cat_title' => 'Kids', 'cat_img' => '1.jpg']);
        Category::create(['cat_title' => 'Women Wear', 'cat_img' => '1.jpg']);
        Category::create(['cat_title' => 'Kids Wear', 'cat_img' => '1610586604.jpg']);

        // SubCategories from zappos.sql
        SubCategory::create(['subcat_title' => 'Shoes', 'subcat_img' => '1.jpg', 'cat_id' => 1, 'handle' => 'Hadi', 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi']);
        SubCategory::create(['subcat_title' => 'Skirts', 'subcat_img' => '1.jpg', 'cat_id' => 2, 'handle' => 'Hadi', 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi']);
        SubCategory::create(['subcat_title' => 'T-Shirt', 'subcat_img' => '1.jpg', 'cat_id' => 1, 'handle' => 'Hadi', 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi']);
        SubCategory::create(['subcat_title' => 'Makeup', 'subcat_img' => '1.jpg', 'cat_id' => 2, 'handle' => 'Hadi', 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi']);
        SubCategory::create(['subcat_title' => 'Panties', 'subcat_img' => '1.jpg', 'cat_id' => 4, 'handle' => 'Testing', 'SEOdescription' => 'Testing', 'SEOtitle' => 'Testing']);
        SubCategory::create(['subcat_title' => 'Earrings', 'subcat_img' => '1610586732.jpg', 'cat_id' => 5, 'handle' => 'Earrings', 'SEOdescription' => 'Earrings', 'SEOtitle' => 'Earrings']);
        SubCategory::create(['subcat_title' => 'Testing', 'subcat_img' => 'Image 1.png', 'cat_id' => 5, 'handle' => 'Testing', 'SEOdescription' => 'Testing', 'SEOtitle' => 'Testing']);

        // CatItems from zappos.sql
        CatItem::create(['cat_item_title' => 'Joggers', 'cat_item_img' => 'Image 1.png', 'subcat_id' => 1, 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi', 'handle' => 'Hadi']);
        CatItem::create(['cat_item_title' => 'Lofers', 'cat_item_img' => '1.jpg', 'subcat_id' => 2, 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi', 'handle' => 'Hadi']);
        CatItem::create(['cat_item_title' => 'Blusher', 'cat_item_img' => '1.jpg', 'subcat_id' => 4, 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi', 'handle' => 'Hadi']);
        CatItem::create(['cat_item_title' => 'Eye Liner', 'cat_item_img' => '1.jpg', 'subcat_id' => 4, 'SEOdescription' => 'Hadi', 'SEOtitle' => 'Hadi', 'handle' => 'Hadi']);
        CatItem::create(['cat_item_title' => 'Converse', 'cat_item_img' => '1.jpg', 'subcat_id' => 1, 'SEOdescription' => 'Converse', 'SEOtitle' => 'Converse', 'handle' => 'Converse']);
        CatItem::create(['cat_item_title' => "Zara's Skirts", 'cat_item_img' => 'Image 1.png', 'subcat_id' => 3, 'SEOdescription' => "Zara's Skirts", 'SEOtitle' => "Zara's Skirts", 'handle' => "Zara's Skirts"]);
        CatItem::create(['cat_item_title' => 'Pendent Earrings', 'cat_item_img' => '1610586941.jpg', 'subcat_id' => 7, 'SEOdescription' => 'Pendent Earrings', 'SEOtitle' => 'Pendent Earrings', 'handle' => 'Pendent Earrings']);
        CatItem::create(['cat_item_title' => 'Umair', 'cat_item_img' => 'Image 1.png', 'subcat_id' => 7, 'SEOdescription' => 'Testing', 'SEOtitle' => 'Testing', 'handle' => 'Testing']);

        // Roles from zappos.sql
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'moderator']);
        Role::create(['name' => 'user']);

        // AdminLogin from zappos.sql (admin user with all permissions)
        AdminLogin::create([
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'f_name' => 'Admin',
            'l_name' => 'User',
            'OrderPage' => 1,
            'ProductPage' => 1,
            'OrderDetailsPage' => 1,
            'AddProductPage' => 1,
            'UpdateProductPage' => 1,
            'CategoryPage' => 1,
            'AddCategoryPage' => 1,
            'UpdateCategoryPage' => 1,
            'CustomerPage' => 1,
            'AboutCustomerPage' => 1,
            'SubcategoryPage' => 1,
            'AddSubcategoryPage' => 1,
            'UpdateSubcategoryPage' => 1,
            'CollectionPage' => 1,
            'AddCollectionPage' => 1,
            'UpdateCollectionPage' => 1,
            'SettingsPage' => 1,
            'GeneralPage' => 1,
            'StaffAccountPage' => 1,
            'StaffAreaPage' => 1,
            'UpdateStaffAreaPage' => 1,
            'TaxPage' => 1,
            'PaymentPage' => 1,
            'NotificationPage' => 1,
            'TranslationPage' => 1,
        ]);

        // CMS Pages from zappos.sql
        CPage::create(['title' => 'Contact Us', 'description' => 'Contact us', 'SEOtitle' => 'Contact Us', 'SEOdescription' => 'Contact Us', 'SEOurl' => 'Contact Us', 'visibility' => 1]);
        CPage::create(['title' => 'Blog', 'description' => '<p><strong>Blog1</strong></p>', 'SEOtitle' => 'Blog', 'SEOdescription' => 'Blog', 'SEOurl' => 'Blog', 'visibility' => 0]);
        CPage::create(['title' => 'About Us', 'description' => '<p>About Us</p>', 'SEOtitle' => 'About Us', 'SEOdescription' => 'About Us', 'SEOurl' => 'About Us', 'visibility' => 0]);
        CPage::create(['title' => 'Report Us', 'description' => '<h2><em>Report Us</em></h2>', 'SEOtitle' => 'Report Us', 'SEOdescription' => 'Report Us', 'SEOurl' => 'Report Us', 'visibility' => 0]);
        CPage::create(['title' => 'Donate Us', 'description' => '<p>Donate Us</p>', 'SEOtitle' => 'Donate Us', 'SEOdescription' => 'Donate Us', 'SEOurl' => 'Donate Us', 'visibility' => 1]);

        // Notifications from zappos.sql
        Notification::create(['title' => 'Registration Successful!', 'description' => 'Welcome to Zappos!']);
        Notification::create(['title' => 'Order Registered!', 'description' => 'Your Order#1 has been successfully registered!']);
        Notification::create(['title' => 'Password Changed!', 'description' => '<html></head></head><body><h1 style="color:red;">Hello</h1></body></html>']);
        Notification::create(['title' => 'Order Canceled!', 'description' => 'We are sorry to say that your order#21 has been canceled due to technical reasons!']);
        Notification::create(['title' => 'Order Refunded!', 'description' => 'Your payment for order#21 has been successfully refunded!']);
        Notification::create(['title' => 'Order Edited!', 'description' => 'Your Order#21 has been successfully edited!']);
        Notification::create(['title' => 'Order Confirmation!', 'description' => 'Your order#21 has been confirmed and will be delivered in two or 3 working days.']);

        // Store settings from zappos.sql
        Store::create(['StoreName' => 'ZARKA COUTURE', 'StoreEmail' => 'admin@zarka.com', 'SenderEmail' => 'admin@zarka.com', 'StoreIndustry' => 'clothing', 'LegalName' => 'ZARKA COUTURE', 'Phone' => '03045260527', 'Streets' => 'Main Street', 'Apartment' => '', 'City' => 'New York', 'ZipCode' => '44000', 'Country' => 'United States', 'TimeZone' => '+00:00', 'UnitSystem' => 'Imperial System', 'WeightUnit' => 'Kilo Gram(Kg)', 'Currency' => 'USD']);

        // Tax from zappos.sql
        Tax::create(['digital' => '0', 'food' => '9', 'nonfood' => '21']);

        // Emarket (email subscribers)
        Emarket::create(['email' => 'hadibutt476@gmail.com']);
    }
}
