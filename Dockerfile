FROM php:8.2-apache

# Install system dependencies & common PHP extensions
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    libmagickwand-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Docker PHP Extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd xml zip

# Install Imagick
RUN pecl install imagick && docker-php-ext-enable imagick

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Setup VirtualHost pointing to Laravel's public directory
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@11.8.0

# Set working directory
WORKDIR /var/www/html

# Copy project files (respects .dockerignore)
COPY . /var/www/html

# Set directory permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Install Node dependencies
RUN if [ -f "package.json" ]; then npm install; fi
# Build Admin themes assets
RUN if [ -d "themes/admin" ]; then cd themes/admin && npm install && npm run build; fi

# Copy start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose Render standard port
EXPOSE 10000

# Run entrypoint script
CMD ["/usr/local/bin/start.sh"]
