<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        if (Store::count() > 0) {
            $store = Store::first();
            $settings = [
                "announcement" => ["text" => "Free Shipping Nationwide — For Queries: 0301 5158089", "bg_color" => "#000000", "text_color" => "#ffffff", "enabled" => false],
                "logo_text" => "ZARKA COUTURE",
                "slides" => [
                    ["id" => "1", "title" => "SATORI 2026", "subtitle" => "STILLNESS & LUXURY", "image" => "banner1.jpg", "btn_text" => "LIVE NOW", "btn_link" => "/shop/luxury-collection"],
                    ["id" => "2", "title" => "FESTIVE EID II 2026", "subtitle" => "NEW ARRIVALS", "image" => "banner.jpg", "btn_text" => "SHOP NOW", "btn_link" => "/shop/unstitched"],
                ],
                "categories_section" => ["enabled" => true, "title" => "Shop By Category"],
                "featured_collections" => ["enabled" => true, "title" => "Featured Collections", "tabs" => [
                    ["label" => "ZSJ BASICS 2026", "category" => "special-edition"],
                    ["label" => "FESTIVE EID II 2026", "category" => "luxury-collection"],
                    ["label" => "PRET EID II 2026", "category" => "summer-edition"],
                    ["label" => "SATORI 2026", "category" => "unique-collection"],
                ]],
                "trending_products" => ["enabled" => true, "title" => "Top Trending Products", "limit" => 5],
                "whatsapp" => ["phone" => "+923173179230", "enabled" => true, "message" => "Hi, I would like to make an inquiry.", "position" => "bottom-right"],
                "installments" => ["enabled" => true, "provider" => "baadmay", "count" => 3],
                "promotional_section" => ["enabled" => true, "left_image" => "luxury fashion 7 1.png", "left_subtitle" => "New Season", "left_title" => "New Arrivals", "left_btn_text" => "Discover Now", "left_btn_link" => "/shop/new-arrivals", "right_image" => "luxury fashion 7 2.png", "right_subtitle" => "Luxury Bridal", "right_title" => "Bridal Couture", "right_btn_text" => "Explore Collection", "right_btn_link" => "/shop/bridals"],
            ];
            $store->update(['theme_settings' => json_encode($settings)]);
            echo "Store updated OK\n";
            return;
        }

        $settings = [
            "announcement" => ["text" => "Free Shipping Nationwide — For Queries: 0301 5158089", "bg_color" => "#000000", "text_color" => "#ffffff", "enabled" => false],
            "logo_text" => "ZARKA COUTURE",
            "slides" => [
                ["id" => "1", "title" => "SATORI 2026", "subtitle" => "STILLNESS & LUXURY", "image" => "banner1.jpg", "btn_text" => "LIVE NOW", "btn_link" => "/shop/luxury-collection"],
                ["id" => "2", "title" => "FESTIVE EID II 2026", "subtitle" => "NEW ARRIVALS", "image" => "banner.jpg", "btn_text" => "SHOP NOW", "btn_link" => "/shop/unstitched"],
            ],
            "categories_section" => ["enabled" => true, "title" => "Shop By Category"],
            "featured_collections" => ["enabled" => true, "title" => "Featured Collections", "tabs" => [
                ["label" => "ZSJ BASICS 2026", "category" => "special-edition"],
                ["label" => "FESTIVE EID II 2026", "category" => "luxury-collection"],
                ["label" => "PRET EID II 2026", "category" => "summer-edition"],
                ["label" => "SATORI 2026", "category" => "unique-collection"],
            ]],
            "trending_products" => ["enabled" => true, "title" => "Top Trending Products", "limit" => 5],
            "whatsapp" => ["phone" => "+923173179230", "enabled" => true, "message" => "Hi, I would like to make an inquiry.", "position" => "bottom-right"],
            "installments" => ["enabled" => true, "provider" => "baadmay", "count" => 3],
            "promotional_section" => ["enabled" => true, "left_image" => "luxury fashion 7 1.png", "left_subtitle" => "New Season", "left_title" => "New Arrivals", "left_btn_text" => "Discover Now", "left_btn_link" => "/shop/new-arrivals", "right_image" => "luxury fashion 7 2.png", "right_subtitle" => "Luxury Bridal", "right_title" => "Bridal Couture", "right_btn_text" => "Explore Collection", "right_btn_link" => "/shop/bridals"],
        ];
        Store::create([
            "StoreName" => "Zarka Couture",
            "StoreEmail" => "info@zarkaboutique.com",
            "theme_settings" => json_encode($settings),
        ]);
        echo "Store seeded OK\n";
    }
}
