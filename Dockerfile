FROM php:8.3-fpm-alpine

# System-Abhängigkeiten
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libzip-dev \
    zip \
    unzip

# PHP Extensions
RUN docker-php-ext-install gd zip

# Verzeichnisse erstellen
RUN mkdir -p /var/www/html/public /var/www/html/storage /run/nginx /var/log/supervisor

# Konfigurationen kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Projektdateien kopieren
COPY . /var/www/html
WORKDIR /var/www/html

# Berechtigungen für den Web-User setzen
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/public && \
    chmod -R 775 /var/www/html/storage

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]