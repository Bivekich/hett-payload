This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Развертывание на сервере с помощью Docker

### Важная информация

Приложение настроено для работы на портах 8090 (HTTP) и 8453 (HTTPS) вместо стандартных 80 и 443, поскольку эти порты могут быть уже заняты другими службами на сервере.

Для развертывания сайта на сервере с помощью Docker выполните следующие шаги:

1. Клонируйте репозиторий на сервер:

```bash
git clone <url-репозитория> /path/to/project
cd /path/to/project
```

2. Инициализируйте SSL-сертификаты для домена:

```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```

3. Запустите контейнеры одной командой:

```bash
docker-compose up -d --build
```

### Настройка основного Nginx на сервере

Если на сервере уже запущен Nginx, вам необходимо создать конфигурацию для проксирования запросов на порты докер-контейнера:

1. Создайте файл конфигурации:

```bash
nano /etc/nginx/sites-available/hettautomotive.ru.conf
```

2. Добавьте следующую конфигурацию:

```
server {
    listen 80;
    server_name hettautomotive.ru www.hettautomotive.ru;

    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    server_name hettautomotive.ru www.hettautomotive.ru;

    ssl_certificate /etc/letsencrypt/live/hettautomotive.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hettautomotive.ru/privkey.pem;

    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Создайте символическую ссылку и перезапустите Nginx:

```bash
ln -s /etc/nginx/sites-available/hettautomotive.ru.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Обновление проекта

Для обновления проекта выполните:

```bash
git pull
docker-compose up -d --build
```

### Просмотр логов

```bash
docker-compose logs -f
```

Для просмотра логов только frontend-сервиса:

```bash
docker-compose logs -f frontend
```
