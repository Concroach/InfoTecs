# Фаза сборки
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Копируем csproj-файл и восстанавливаем зависимости
COPY *.csproj ./
RUN dotnet restore

# Копируем остальной код и выполняем сборку
COPY . .
RUN dotnet publish -c Release -o out

# Фаза выполнения
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Задаем порт, на котором будет работать API
EXPOSE 44372

# Запускаем приложение
ENTRYPOINT ["dotnet", "API.dll"]