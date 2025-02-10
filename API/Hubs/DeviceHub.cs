using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;
public class DeviceHub : Hub
{
    public async Task SendActivityUpdate(DeviceActivity activity)
    {
        await Clients.All.SendAsync("ReceiveActivityUpdate", activity);
    }
}