FROM php:8.3-fpm-alpine

# System-Abhängigkeiten installieren
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libzip-dev \
    zip \
    unzip

# PHP Extensions
RUN docker-php-ext-install gd zip

# Notwendige System-Verzeichnisse erstellen
RUN mkdir -p /run/nginx /var/log/supervisor /var/www/html/storage /var/www/html/public

# Konfigurationsdateien kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Das gesamte Projekt in das Arbeitsverzeichnis kopieren
WORKDIR /var/www/html
COPY . .

# Berechtigungen setzen
# Der User 'www-data' muss Besitzer des Codes sein
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/public && \
    chmod -R 775 /var/www/html/storage

# Nginx soll auf Port 80 lauschen
EXPOSE 80

# Start über Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]