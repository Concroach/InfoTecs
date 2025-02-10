using API.Hubs;
using API.Logging;
using API.Repositories;
using API.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
var logFilePath = Path.Combine(AppContext.BaseDirectory, "logs", $"app_{datePart}.log");

builder.Logging.ClearProviders();
builder.Logging.AddProvider(new AsyncFileLoggerProvider(logFilePath));

builder.Services.AddSingleton<IDeviceRepository, InMemoryRepository>();
builder.Services.AddSingleton<IDeviceService, DeviceService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Monitoring Service API", Version = "v1" });
});
builder.WebHost.UseUrls("http://*:44372");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:5000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSignalR();
var app = builder.Build();
app.MapHub<DeviceHub>("/devicehub");
app.UseCors("AllowSpecificOrigin");

if (app.Environment.IsDevelopment())
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Monitoring Service API v1");
        });
    }
}
app.MapControllers();

app.Run();