# Фаза сборки
FROM node:18-alpine AS build
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код и выполняем сборку
COPY . .
RUN npm run build --prod

# Фаза выполнения
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Копируем собранные файлы в директорию Nginx
COPY --from=build /app/dist/SPA .

# Задаем конфигурацию Nginx (если нужно)
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт для доступа к SPA
EXPOSE 4200
