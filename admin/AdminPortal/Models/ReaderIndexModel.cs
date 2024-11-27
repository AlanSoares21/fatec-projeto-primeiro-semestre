using AdminPortal.Models.Cache;
using LeiaApi.Models;

namespace AdminPortal.Models;

public class ReaderIndexModel
{
    public string FileContent { get; set; } = null!;
    public LiteraryWork Work { get; set; } = new();
}
