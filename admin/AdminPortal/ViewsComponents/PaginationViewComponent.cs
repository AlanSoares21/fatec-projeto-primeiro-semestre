using Microsoft.AspNetCore.Mvc;

namespace AdminPortal.ViewsComponents;

public class PaginationViewComponent: ViewComponent
{
    public IViewComponentResult Invoke(
        long start,
        int count,
        long total,
        Dictionary<string, string> query)
    {
        if (count <= 0)
            count = 1;

        long last;
        if (total % count == 0)
            last = total - count;
        else
            last = (total / count) * count;

        return View(new PaginationComponentModel() {
            RouteParams = query,
            Count = count,
            CurrentIndex = start,
            NextIndex = start + count,
            PreviousIndex = start - count,
            CurrentPage = (start / count) + 1,
            LastValidIndex = last,
            Total = total
        });
    }
}