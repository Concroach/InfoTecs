using API.Models;

namespace API.Services;

public interface IDeviceService
{
    void SubmitActivity(DeviceActivity activity);
    
    IEnumerable<DeviceActivity> GetAllActivities();
    
    IEnumerable<DeviceActivity> GetActivitiesByDeviceId(Guid deviceId);
    
    void CleanupOldRecords(DateTime threshold);
}