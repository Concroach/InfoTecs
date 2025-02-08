using API.Models;
using API.Repositories;

namespace API.Services;

using System;
using System.Collections.Generic;

public class DeviceService : IDeviceService
{
    private readonly IDeviceRepository _repository;

    public DeviceService(IDeviceRepository repository)
    {
        _repository = repository;
    }

    public void SubmitActivity(DeviceActivity activity)
    {
        _repository.AddActivity(activity);
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