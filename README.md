# Hett Payload

## Развертывание приложения с использованием Docker

### Предварительные требования
- Docker
- Docker Compose

### Настройка переменных окружения
1. Создайте файл `.env` с необходимыми переменными окружения:
   ```
   # Настройки Next.js
   NEXT_PUBLIC_PAYLOAD_API_URL=http://cms:3001
   NEXT_PUBLIC_PAYLOAD_API_TOKEN=your_api_token_here
   NEXT_PUBLIC_CMS_URL=http://cms:3001
   
   # Настройки уведомлений через Telegram
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_telegram_chat_id_here
   
   # Настройки Email
   NEXT_PUBLIC_EMAIL_HOST=smtp.example.com
   NEXT_PUBLIC_EMAIL_PORT=587
   NEXT_PUBLIC_EMAIL_USER=user@example.com
   NEXT_PUBLIC_EMAIL_PASS=your_email_password_here
   NEXT_PUBLIC_EMAIL_FROM=Hett Automotive <noreply@hettauto.com>
   NEXT_PUBLIC_EMAIL_TO=info@hettauto.com
   
   # Настройки сервера
   PORT=3001
   NODE_ENV=production
   ```
2. Отредактируйте файл `.env` и заполните все необходимые параметры.

### Сборка и запуск
1. Соберите Docker-образ:
   ```
   docker-compose build
   ```
2. Запустите приложение:
   ```
   docker-compose up -d
   ```
3. Для просмотра логов:
   ```
   docker-compose logs -f
   ```
4. Для остановки приложения:
   ```
   docker-compose down
   ```

### Доступ к приложению
После запуска приложение будет доступно по адресу:
- Frontend: `http://localhost:3008`

## Структура проекта
- `/public` - статические файлы
- `/src` - исходный код приложения
  - `/app` - Next.js страницы и маршруты
  - `/assets` - ресурсы (иконки, изображения)
  - `/components` - компоненты React
  - `/hooks` - пользовательские хуки
  - `/services` - сервисы для работы с API
  - `/types` - TypeScript типы
  - `/utils` - утилиты и вспомогательные функции 