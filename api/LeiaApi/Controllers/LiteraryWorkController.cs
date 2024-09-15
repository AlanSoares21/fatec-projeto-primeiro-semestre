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
}