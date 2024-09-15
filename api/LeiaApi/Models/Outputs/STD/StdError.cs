using System.Net;

namespace LeiaApi.Models;

public class StdError
{
    public string Message { get; set; } = null!;
    public HttpStatusCode StatusCode { get; set; }
}