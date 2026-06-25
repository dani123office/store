#!/bin/bash

# Railway provides a PORT env variable — Apache must listen on it
if [ ! -z "$PORT" ]; then
    sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
    sed -i "s/:80/:$PORT/" /etc/apache2/sites-available/*.conf
fi

# Run migrations on startup (safe for SQLite)
php /var/www/html/artisan migrate --force 2>/dev/null || true

# Seed database if users table is empty
php -r "
    try {
        require 'vendor/autoload.php';
        \$app = require_once 'bootstrap/app.php';
        \$kernel = \$app->make(Illuminate\Contracts\Console\Kernel::class);
        \$kernel->bootstrap();
        if (Illuminate\Support\Facades\Schema::hasTable('users') && Illuminate\Support\Facades\DB::table('users')->count() === 0) {
            echo 'Database empty, seeding...';
            Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        }
    } catch (\Exception \$e) {
        echo 'Seed error: ' . \$e->getMessage();
    }
"

# Start Apache
apache2-foreground
