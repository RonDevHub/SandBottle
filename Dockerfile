FROM php:8.3-fpm-alpine

# System-Abhängigkeiten
RUN apk add --no-cache nginx supervisor libpng-dev libzip-dev zip unzip

# PHP Extensions
RUN docker-php-ext-install gd zip

# Verzeichnisse erstellen
RUN mkdir -p /run/nginx /var/log/supervisor /var/www/html/storage /var/www/html/public

# ALTE CONFIGS LÖSCHEN (Wichtig!)
RUN rm -rf /etc/nginx/http.d/* /etc/nginx/conf.d/*

# Konfigurationen kopieren
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Projektdateien kopieren
WORKDIR /var/www/html
COPY . .

# DEBUG: Zeige im Log an, wo die Dateien liegen (Hilft uns bei der Fehlersuche)
RUN echo "Inhalt von /var/www/html/public:" && ls -R /var/www/html/public

# Berechtigungen
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]