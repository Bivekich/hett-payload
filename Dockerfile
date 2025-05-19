FROM node:20-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Установка переменных окружения для сборки
ARG NEXT_PUBLIC_PAYLOAD_API_URL
ARG NEXT_PUBLIC_PAYLOAD_API_TOKEN
ARG NEXT_PUBLIC_CMS_URL
ARG NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
ARG NEXT_PUBLIC_TELEGRAM_CHAT_ID
ARG NEXT_PUBLIC_EMAIL_HOST
ARG NEXT_PUBLIC_EMAIL_PORT
ARG NEXT_PUBLIC_EMAIL_USER
ARG NEXT_PUBLIC_EMAIL_PASS
ARG NEXT_PUBLIC_EMAIL_FROM
ARG NEXT_PUBLIC_EMAIL_TO

# Сборка приложения
RUN npm run build

# Запуск приложения
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3001

# Копирование необходимых файлов
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Установка пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Запуск приложения
EXPOSE 3001
CMD ["node", "server.js"] 