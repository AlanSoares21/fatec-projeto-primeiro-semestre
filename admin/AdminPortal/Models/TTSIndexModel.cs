using AdminPortal.Models.Cache;
using LeiaApi.Models;

namespace AdminPortal.Models;

public class TTSIndexModel
{
    public StdPagination Pagination { get; set; } = new();
    public StdList<LiteraryWork> Works { get; set; } = new();

    public List<TTSQueueEntry> WorksInTheQueue { get; set; } = new();
}
