using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AdminPortal.Models;
using LeiaApi.Services;
using LeiaApi.Models;
using System.Text;

namespace AdminPortal.Controllers;

public class ReaderController : Controller
{
    private readonly ILogger<ReaderController> _logger;
    ILiteraryWorkService _lwService;
    string _apiUrl;

    public ReaderController(
        ILogger<ReaderController> logger,
        ILiteraryWorkService lwService,
        IConfiguration configuration)
    {
        _logger = logger;
        _lwService = lwService;
        _apiUrl = configuration["ApiUrl"]?? "";
    }

    public async Task<IActionResult> Index(string workId)
    {
        var work = await _lwService.SearchWorkById(workId);
        
        if (work is null)
            return View("NotFound");

        string text;
        using(var file = await _lwService.ChapterFile(workId, 0)){
            byte[] content = new byte[file.Length];
            file.Read(content);
            text = Encoding.UTF8.GetString(content);
        }

        return View(new ReaderIndexModel() {
            ApiUrl = _apiUrl,
            FileContent = text,
            Work = work
        });
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
