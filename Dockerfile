FROM node:18-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app

# Копирование файлов с зависимостями
COPY package.json package-lock.json ./
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Создание .env.production
RUN touch .env.production
RUN echo "NEXT_PUBLIC_PAYLOAD_API_URL=https://cms.hettautomotive.ru" >> .env.production
RUN echo "NEXT_PUBLIC_APP_URL=https://hettautomotive.ru" >> .env.production

# Сборка проекта
RUN npm run build

# Запуск приложения
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Создание пользователя nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копирование необходимых файлов из сборки
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Запуск сервера
CMD ["node", "server.js"]
