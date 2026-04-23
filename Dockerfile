FROM php:8.3-fpm-alpine

# System-Abhängigkeiten
RUN apk add --no-cache nginx supervisor libpng-dev libzip-dev zip unzip

# PHP Extensions
RUN docker-php-ext-install gd zip

# Verzeichnisse erstellen
RUN mkdir -p /run/nginx /var/log/supervisor /var/www/html/storage /var/www/html/public

# Nginx Standard-Configs radikal entfernen
RUN rm -f /etc/nginx/http.d/default.conf && \
    rm -f /etc/nginx/conf.d/default.conf

# Unsere Konfigurationen kopieren
COPY docker/nginx.conf /etc/nginx/http.d/sandbottle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Projektdateien kopieren
WORKDIR /var/www/html
COPY . .

# Berechtigungen (755 für Ordner, damit Nginx 'reinschauen' darf)
RUN chown -R www-data:www-data /var/www/html && \
    find /var/www/html -type d -exec chmod 755 {} \; && \
    find /var/www/html -type f -exec chmod 644 {} \; && \
    chmod -R 775 /var/www/html/storage

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]