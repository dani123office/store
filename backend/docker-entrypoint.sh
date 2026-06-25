#!/bin/bash

# Railway provides a PORT env variable — Apache must listen on it
if [ ! -z "$PORT" ]; then
    sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
    sed -i "s/:80/:$PORT/" /etc/apache2/sites-available/*.conf
fi

# Run migrations on startup (safe for SQLite)
php /var/www/html/artisan migrate --force 2>/dev/null || true

# Start Apache
apache2-foreground
