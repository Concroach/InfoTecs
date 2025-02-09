# Фаза сборки
FROM node:18-alpine AS build
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Выполняем сборку
RUN npm run build --prod

# Фаза выполнения
FROM node:18-alpine
WORKDIR /app/dist/SPA

# Устанавливаем http-server
RUN npm install -g http-server

# Открываем порт для доступа к SPA
EXPOSE 4200

# Запускаем http-server
CMD ["http-server", ".", "-p", "4200", "-a", "0.0.0.0", "-c-1", "-d", "false"]
