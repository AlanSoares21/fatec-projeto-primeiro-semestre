using System.Net;
using LeiaApi.Models;
using MongoDB;
using MongoDB.Driver;

namespace LeiaApi.Services;

public class LiteraryWorkService : ILiteraryWorkService
{
    IMongoCollection<LiteraryWork> _works;
    private readonly string _chaptersContentPath;
    private ILogger<LiteraryWorkService> _log;
    public LiteraryWorkService(
        IConfiguration config,
        ILogger<LiteraryWorkService> logger
    ) {
        var mongoClient = new MongoClient(config["MongoDbConnStr"]);
        var db = mongoClient.GetDatabase(config["MongoDbName"]);
        _works = db.GetCollection<LiteraryWork>("literaryWorks");
        _chaptersContentPath = config["ChaptersContentPath"] ?? "";
        _log = logger;
    }

    public async Task<FileStream> ChapterFile(string lwid, int chapterIndex)
    {
        var work = (await _works.FindAsync(
            w => w.Id == lwid
        )).FirstOrDefault();
        if (work is null)
            throw new ApiException(
                HttpStatusCode.NotFound, 
                "Work " + lwid + " not found."
            );
        if (work.Chapters.Count <= chapterIndex)
            throw new ApiException(
                HttpStatusCode.NotFound, 
                "Work " + lwid + " dont have a chapter " + chapterIndex
            );
        var chapter = work.Chapters[chapterIndex];
        string realPath = Path.Join(_chaptersContentPath, chapter.FilePath);
        if (!Path.Exists(realPath)) {
            _log.LogCritical(
                "Chapter content in {path} not found. chapter: {index}, work: {work}",
                realPath,
                chapterIndex,
                work.Id
            );
            throw new ApiException(
                HttpStatusCode.BadRequest,
                "Content for the chapter "+ chapterIndex + " from the work " + work.Id + " not found"
            );
        }
        return File.OpenRead(realPath);
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

    public async Task<LiteraryWork?> SearchWorkById(string lwid)
    {
        var c = await _works.FindAsync(w => w.Id == lwid);
        return c.SingleOrDefault();
    }
}