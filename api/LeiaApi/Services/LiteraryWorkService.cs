using LeiaApi.Models;
using MongoDB;
using MongoDB.Driver;

namespace LeiaApi.Services;

public class LiteraryWorkService : ILiteraryWorkService
{
    IMongoCollection<LiteraryWork> _works;
    public LiteraryWorkService(IConfiguration config) {
        var mongoClient = new MongoClient(config["MongoDbConnStr"]);
        var db = mongoClient.GetDatabase(config["MongoDbName"]);
        _works = db.GetCollection<LiteraryWork>("literaryWorks");
    }
    public async Task<StdList<LiteraryWork>> ListWorks(StdPagination query, string? userId = null)
    {
        StdList<LiteraryWork> response = new();
        var mgquery = _works.Find(w => w.Chapters.Where(c => c.Size > 4).Count() > 0);
        response.Total = await mgquery.CountDocumentsAsync();

        response.Data = await mgquery
            .Skip((int)query.Start)
            .Limit(query.Count)
            .ToListAsync();
        response.Count = response.Data.Count;
        response.Start = query.Start;
        return response;
    }
}