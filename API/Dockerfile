# Фаза выполнения
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Задаем порт, на котором будет работать API
EXPOSE 44372

# Запускаем приложение
ENTRYPOINT ["dotnet", "API.dll"]