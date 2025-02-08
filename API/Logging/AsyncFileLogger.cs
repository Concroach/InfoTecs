namespace API.Logging;

using Microsoft.Extensions.Logging;
using System;

public class AsyncFileLogger : ILogger
{
    private readonly string _categoryName;
    private readonly AsyncFileLoggerProvider _provider;

    public AsyncFileLogger(string categoryName, AsyncFileLoggerProvider provider)
    {
        _categoryName = categoryName;
        _provider = provider;
    }

    public IDisposable BeginScope<TState>(TState state) => null;

    public bool IsEnabled(LogLevel logLevel) => _provider.IsEnabled(logLevel);

    public async void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
    {
        if (!IsEnabled(logLevel)) return;

        var message = formatter(state, exception);
        if (string.IsNullOrEmpty(message)) return;

        var logEntry = $"{DateTime.UtcNow:yyyy-MM-ddTHH:mm:ss.fffZ} [{logLevel}] {_categoryName}: {message}";
        if (exception != null)
        {
            logEntry += Environment.NewLine + exception.ToString();
        }

        await _provider.WriteLogAsync(logEntry);
    }
}