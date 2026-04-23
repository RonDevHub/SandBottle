# Stage: PHP & Nginx Runtime
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
RUN mkdir -p /var/www/html /run/nginx /var/log/supervisor /var/www/html/storage

# Konfigurationen kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Projektdateien kopieren
COPY . /var/www/html
WORKDIR /var/www/html

# BERECHTIGUNGEN KORRIGIERT:
# Wir setzen den Besitzer auf www-data (den Standard-User für PHP-FPM/Nginx)
RUN chown -R www-data:www-data /var/www/html/storage && \
    chmod -R 775 /var/www/html/storage

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]