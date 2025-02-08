using API.Models;

namespace API.Repositories;

public interface IDeviceRepository
{
    void AddActivity(DeviceActivity activity);
    
    IEnumerable<DeviceActivity> GetAllActivities();
    
    IEnumerable<DeviceActivity> GetActivitiesByDeviceId(Guid deviceId);
    
    void RemoveOldRecords(DateTime threshold);
}