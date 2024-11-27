using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AdminPortal.Models;
using LeiaApi.Services;
using LeiaApi.Models;

namespace AdminPortal.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    ILiteraryWorkService _lwService;

    public HomeController(
        ILogger<HomeController> logger,
        ILiteraryWorkService lwService)
    {
        _logger = logger;
        _lwService = lwService;
    }

    public async Task<IActionResult> Index([FromQuery]StdPagination query)
    {
        var works = await _lwService.ListWorks(query);
        return View(new HomeIndexModel() {
            Pagination = query,
            Works = works
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
