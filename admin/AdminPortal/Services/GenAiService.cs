
using System.Text.Json;
using AdminPortal.Models.Cache;
using Microsoft.Extensions.Caching.Distributed;

namespace AdminPortal.Services;

public class GenAiService : IGenAiService
{
    private ILogger<GenAiService> _log;
    private IDistributedCache _cache;
    private readonly string WORKS_TTS_QUEUE_KEY = "QUEUE-TTS";
    public GenAiService(
        ILogger<GenAiService> logger,
        IDistributedCache cache) {
        _log = logger;
        _cache = cache;
    }
    public async Task AddWorksInTheQueue(List<TTSQueueEntry> works)
    {
        string worksStr = string.Join(',', works.Select(w => w.WorkId));
        _log.LogInformation("Adding {count} works in TTS Queue - works: {work}", 
            works.Count,
            worksStr);
        List<TTSQueueEntry> queue = await GetWorksInTheQueue();
        queue.AddRange(works);
        string json = JsonSerializer.Serialize(queue);
        await _cache.SetStringAsync(WORKS_TTS_QUEUE_KEY, json);
        _log.LogInformation("{count} works added in TTS Queue - Queue size: {size} - works: {work}", 
            works.Count,
            queue.Count,
            worksStr);
    }

    public async Task<List<TTSQueueEntry>> GetWorksInTheQueue()
    { 
        var json = await _cache.GetStringAsync(WORKS_TTS_QUEUE_KEY);
        if (json is null)
            return new List<TTSQueueEntry>();
        List<TTSQueueEntry>? queue = JsonSerializer.Deserialize<List<TTSQueueEntry>?>(json);
        if (queue is null)
            return new List<TTSQueueEntry>();
        return queue;
    }

    public async Task<bool> RemoveWorkInTheList(string workId)
    {
        var queue = await GetWorksInTheQueue();
        _log.LogInformation("Searching work {id} in the queue to remove it - queue size: {c}",
            workId,
            queue.Count);
        int index = queue.FindIndex(w => w.WorkId == workId);
        if (index == -1) {
            _log.LogInformation("Work {id} not found in the queue to be removed.", workId);
            return false;
        }
        var work = queue[index];
        _log.LogInformation("Removing work {id} from the queue - RequestedAt: {d}", 
            work.WorkId,
            work.RequestedAt);
        if (!queue.Remove(work)) {
            _log.LogInformation("Fail to remove work {id} from the queue - queue size: {s} - RequestedAt: {d}", 
                work.WorkId,
                queue.Count,
                work.RequestedAt);
            return false;
        }
        _log.LogInformation("Serializing the queue after remove - work: {id} - RequestedAt: {d} - queue size: {s}", 
            work.WorkId,
            work.RequestedAt,
            queue.Count);
        string json = JsonSerializer.Serialize(queue);
        await _cache.SetStringAsync(WORKS_TTS_QUEUE_KEY, json);
        _log.LogInformation("Work {id} removed from the queue - queue size: {s}", 
            work.WorkId,
            queue.Count);
        return true;
    }
}