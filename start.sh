#!/bin/bash
set -e

# Change Apache listen port based on Render's $PORT env var (Render default is 10000)
PORT=${PORT:-10000}
sed -i "s/80/$PORT/g" /etc/apache2/ports.conf
sed -i "s/:80/:$PORT/g" /etc/apache2/sites-available/000-default.conf

# Setup Env if not present (although Render allows passing env variables, it's safe to fallback to .env.testing for this vibe project)
if [ ! -f .env ] && [ -f .env.testing ]; then 
    cp .env.testing .env
fi

# Ensure SQLite database exists
if [ ! -f storage/app/database.sqlite ]; then
    touch storage/app/database.sqlite
    chown www-data:www-data storage/app/database.sqlite
fi

# Run migrations
php artisan migrate --force || true

# Generate Swagger
php artisan l5-swagger:generate || true

# Clear and cache config/routes if needed
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting Apache on port $PORT..."
exec apache2-foreground
