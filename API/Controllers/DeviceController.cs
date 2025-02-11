using System.Text.Json;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeviceController : ControllerBase
{
    private readonly IDeviceService _service;
    private readonly ILogger<DeviceController> _logger;

    public DeviceController(IDeviceService service, ILogger<DeviceController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost("submit")]
    public IActionResult SubmitActivity([FromBody] DeviceActivity activity)
    {
        _logger.LogInformation($"Activity submitted: {activity.Id}");
        _service.SubmitActivity(activity);
        return Ok();
    }

    [HttpGet("all")]
    public IActionResult GetAllActivities()
    {
        var activities = _service.GetAllActivities();
        return Ok(activities);
    }

    [HttpGet("{deviceId}")]
    public IActionResult GetActivitiesByDeviceId(Guid deviceId)
    {
        var activities = _service.GetActivitiesByDeviceId(deviceId);

        if (!activities.Any())
        {
            return NotFound();
        }

        return Ok(activities);
    }

    [HttpDelete("cleanup")]
    public IActionResult CleanupOldRecords([FromQuery] DateTime threshold)
    {
        _service.CleanupOldRecords(threshold);
        
        return NoContent();
    }
    
    [HttpGet("backup")]
    public IActionResult BackupData()
    {
        var activities = _service.GetAllActivities();
        var json = JsonSerializer.Serialize(activities);

        try
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);

            var stream = new MemoryStream(bytes);

            return File(stream, "application/json", "backup.json");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to create or send backup file: {ex.Message}");
            return StatusCode(500, "Failed to create or send backup file");
        }
    }
}