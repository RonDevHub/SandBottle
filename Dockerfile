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

# Verzeichnisse für Logs und Prozesse
RUN mkdir -p /run/nginx /var/log/supervisor /var/www/html/storage /var/www/html/public

# Konfigurationsdateien kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Den gesamten Projekt-Code kopieren
WORKDIR /var/www/html
COPY . .

# Berechtigungen: Wir setzen alles auf den User 'www-data'
# PHP-FPM läuft auf Alpine standardmäßig als www-data
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 /var/www/html/storage

# Nginx User-Konflikt lösen: Wir lassen Nginx im Hauptprozess als www-data laufen
RUN sed -i 's/user nginx;/user www-data;/g' /etc/nginx/nginx.conf || echo "user www-data;" >> /etc/nginx/nginx.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]