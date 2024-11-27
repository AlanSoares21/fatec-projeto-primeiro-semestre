using AdminPortal.Models.Cache;
using LeiaApi.Models;

namespace AdminPortal.Models;

public class ReaderIndexModel
{
    public string ApiUrl { get; set; } = null!;
    public string FileContent { get; set; } = null!;
    public LiteraryWork Work { get; set; } = new();
}
