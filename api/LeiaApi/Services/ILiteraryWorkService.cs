using LeiaApi.Models;

namespace LeiaApi.Services;

public interface ILiteraryWorkService {
    Task<StdList<LiteraryWork>> ListWorks(StdPagination query, string? userId = null);
}