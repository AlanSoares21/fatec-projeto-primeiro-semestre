using LeiaApi.Models;
using LeiaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeiaApi.Controllers;

public class LiteraryWorkController: StdController
{
    [HttpGet]
    public async Task<IActionResult> ListWorks(
        [FromQuery] StdPagination query, 
        ILiteraryWorkService ltwkSvc
    ) {
        return Ok(await ltwkSvc.ListWorks(query));
    }

    [HttpGet("{lwid}/chapter/{chapterIndex}")]
    public async Task<IActionResult> Chapter(
        string lwid, 
        int chapterIndex,
        ILiteraryWorkService ltwkSvc
    ) {
        return File(
            await ltwkSvc.ChapterFile(lwid, chapterIndex), 
            "application/html; charset=utf-8"
        );
    }
}