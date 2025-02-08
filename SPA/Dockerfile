# Фаза выполнения
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Копируем собранные файлы в директорию Nginx
COPY --from=build /app/dist/SPA .

# Задаем порт для доступа к SPA
EXPOSE 4200
