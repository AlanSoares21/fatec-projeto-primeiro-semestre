public class PaginationComponentModel
{
    public Dictionary<string, string> RouteParams {get; set;} = null!;
    public long CurrentPage { get; set; }
    public long PreviousIndex { get; set; }
    public long CurrentIndex { get; set; }
    public long NextIndex { get; set; }
    public int Count { get; set; }
    public long Total { get; set; }
    public long LastValidIndex { get; set; }
}