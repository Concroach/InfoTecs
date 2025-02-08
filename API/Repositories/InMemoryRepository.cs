using API.Models;

namespace API.Repositories;

public class InMemoryRepository : IDeviceRepository
{
    private readonly Dictionary<Guid, List<DeviceActivity>> _data;

    public InMemoryRepository()
    {
        _data = new Dictionary<Guid, List<DeviceActivity>>();
    }

    public void AddActivity(DeviceActivity activity)
    {
        if (!_data.TryGetValue(activity.Id, out List<DeviceActivity>? value))
        {
            value = new List<DeviceActivity>();
            _data[activity.Id] = value;
        }

        value.Add(activity);
    }

    public IEnumerable<DeviceActivity> GetAllActivities()
    {
        return _data.Values.SelectMany(x => x);
    }

    public IEnumerable<DeviceActivity> GetActivitiesByDeviceId(Guid deviceId)
    {
        return _data.TryGetValue(deviceId, out var value) ? value : Enumerable.Empty<DeviceActivity>();
    }

    public void RemoveOldRecords(DateTime threshold)
    {
        foreach (var kvp in _data.ToList())
        {
            var activities = kvp.Value.Where(a => a.EndTime < threshold).ToList();
            foreach (var activity in activities)
            {
                kvp.Value.Remove(activity);
            }
            if (kvp.Value.Count == 0)
            {
                _data.Remove(kvp.Key);
            }
        }
    }
}