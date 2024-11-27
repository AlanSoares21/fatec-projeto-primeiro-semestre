using AdminPortal.Models.Cache;
using LeiaApi.Models;

namespace AdminPortal.Models;

public class HomeIndexModel
{
    public StdPagination Pagination { get; set; } = new();
    public StdList<LiteraryWork> Works { get; set; } = new();
}
