FROM public.ecr.aws/composer/composer:2.5 as composer

FROM php:7.4.0-fpm-alpine

# install composer
COPY --from=composer /usr/bin/composer /usr/bin/composer
ENV COMPOSER_HOME="/tmp/composer"

RUN apk update \
    && apk upgrade \
    && apk --update add \
        libmemcached \
        libzip-dev \
        freetype-dev\
        libwebp-dev \
        libjpeg-turbo-dev\
        libpq \
        libjpeg \
        libpng \
        openssh-server \
        git \
        nano \
        libxml2-dev \
        mariadb-client \
        unzip \
        icu-dev \
        gmp-dev \
        libpng-dev \
        shadow

RUN docker-php-ext-install zip
RUN docker-php-ext-install soap
RUN docker-php-ext-install exif
RUN docker-php-ext-install pcntl
#RUN docker-php-ext-install pdo_mysql
#RUN docker-php-ext-install pdo_pgsql
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install intl
RUN docker-php-ext-install gmp
RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable pdo_mysql
RUN docker-php-ext-install gd

RUN docker-php-ext-install opcache

RUN apk add --no-cache pcre-dev $PHPIZE_DEPS

# configure gd
#RUN  docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ --with-webp=/usr/include/
RUN docker-php-ext-install -j$(nproc) gd

# Install igbinary
RUN pecl install igbinary \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable igbinary \
    && php -m | grep igbinary


# Install redis driver
RUN mkdir -p /tmp/pear \
    && cd /tmp/pear \
    && pecl bundle redis \
    && cd redis \
    && phpize . \
    && ./configure --enable-redis-igbinary \
    && make \
    && make install \
    && cd ~ \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis \
    && php -m | grep redis

ARG UNAME

WORKDIR /var/www/modx
CMD chmod -R 777 /var/www/modx

CMD ["php-fpm", "-R"]