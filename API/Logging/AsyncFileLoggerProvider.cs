namespace API.Logging;

using Microsoft.Extensions.Logging;
using System;
using System.IO;

public class AsyncFileLoggerProvider : ILoggerProvider
{
    private readonly string _logFilePath;

    public AsyncFileLoggerProvider(string logFilePath)
    {
        _logFilePath = logFilePath;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return new AsyncFileLogger(categoryName, this);
    }

    public void Dispose()
    {
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return logLevel >= LogLevel.Information;
    }

    public async Task WriteLogAsync(string message)
    {
        try
        {
            var logDirectory = Path.GetDirectoryName(_logFilePath);
            if (!Directory.Exists(logDirectory))
            {
                Directory.CreateDirectory(logDirectory);
            }

            await File.AppendAllTextAsync(_logFilePath, message + Environment.NewLine);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to write log: {ex.Message}");
        }
    }
}