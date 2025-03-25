#!/bin/bash

# Domains для которых нужно получить сертификаты
domains=(hettautomotive.ru www.hettautomotive.ru)
rsa_key_size=4096
data_path="./nginx/certbot"
email="maxelichev@gmail.com" # Используется для уведомлений Let's Encrypt

# Необязательные флаги: --staging для тестирования
staging=0

# Создаем директории для сертификатов
if [ ! -d "$data_path/conf/live" ]; then
  mkdir -p "$data_path/conf/live/hettautomotive.ru"
fi

# Создаем временные самоподписанные сертификаты
openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
  -keyout $data_path/conf/live/hettautomotive.ru/privkey.pem \
  -out $data_path/conf/live/hettautomotive.ru/fullchain.pem \
  -subj '/CN=hettautomotive.ru'

# Запускаем контейнеры для получения сертификатов
docker-compose up -d nginx

# Запрашиваем сертификаты через внешний certbot
echo "Получение сертификатов через внешний certbot..."
echo "Запускайте на сервере certbot вручную после настройки DNS и открытия портов"
echo "Пример команды:"
echo "certbot certonly --webroot -w /var/www/certbot -d hettautomotive.ru -d www.hettautomotive.ru"

# Перезапускаем NGINX для применения новых сертификатов
docker-compose restart nginx
