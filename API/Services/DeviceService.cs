using API.Hubs;
using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace API.Services;

using System;
using System.Collections.Generic;

public class DeviceService : IDeviceService
{
    private readonly IDeviceRepository _repository;
    private readonly IHubContext<DeviceHub> _hubContext;

    public DeviceService(IDeviceRepository repository, IHubContext<DeviceHub> hubContext)
    {
        _repository = repository;
        _hubContext = hubContext;
    }

    public void SubmitActivity(DeviceActivity activity)
    {
        _repository.AddActivity(activity);
        _hubContext.Clients.All.SendAsync("ReceiveActivityUpdate", activity).Wait();
    }

    public IEnumerable<DeviceActivity> GetAllActivities()
    {
        return _repository.GetAllActivities();
    }

    public IEnumerable<DeviceActivity> GetActivitiesByDeviceId(Guid deviceId)
    {
        return _repository.GetActivitiesByDeviceId(deviceId);
    }

    public void CleanupOldRecords(DateTime threshold)
    {
        _repository.RemoveOldRecords(threshold);
    }
}