using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AdminPortal.Models;
using LeiaApi.Services;
using AdminPortal.Services;
using LeiaApi.Models;
using AdminPortal.Models.Cache;

namespace AdminPortal.Controllers;

public class TTSController : Controller
{
    private readonly ILogger<TTSController> _logger;
    private ILiteraryWorkService _lwService;
    private IGenAiService _genAiService;

    public TTSController(
        ILogger<TTSController> logger, 
        ILiteraryWorkService lwService,
        IGenAiService genAiService)
    {
        _logger = logger;
        _lwService = lwService;
        _genAiService = genAiService;
    }

    public async Task<IActionResult> Index([FromQuery]StdPagination query)
    {
        var works = await _lwService.ListWorks(query);
        var worksInTheQueue = await _genAiService.GetWorksInTheQueue();
        return View(new TTSIndexModel() {
            Pagination = query,
            Works = works,
            WorksInTheQueue = worksInTheQueue
        });
    }

    public async Task<IActionResult> AddWorksInTheQueue(List<string> workIds)
    {
        var requestedAt = DateTime.UtcNow;
        List<TTSQueueEntry> works = workIds.Select(id => new TTSQueueEntry() {
            RequestedAt = requestedAt,
            WorkId = id
        }).ToList();
        await _genAiService.AddWorksInTheQueue(works);
        return RedirectToAction("Index");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
