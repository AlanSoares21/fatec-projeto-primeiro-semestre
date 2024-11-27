using AdminPortal.Models.Cache;

namespace AdminPortal.Services;

public interface IGenAiService {
    Task<List<TTSQueueEntry>> GetWorksInTheQueue();
    Task AddWorksInTheQueue(List<TTSQueueEntry> works);
    Task<bool> RemoveWorkInTheList(string workId);
}