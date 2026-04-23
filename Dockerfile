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
RUN mkdir -p /var/www/html /run/nginx /var/log/supervisor

# Nginx User auf www-data umstellen (wichtig für Alpine)
RUN sed -i 's/user nginx;/user www-data;/g' /etc/nginx/nginx.conf

# Konfigurationen kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Projektdateien kopieren
WORKDIR /var/www/html
COPY . .

# Berechtigungen für das gesamte Projekt setzen
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]