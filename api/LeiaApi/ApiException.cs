using System.Net;

namespace LeiaApi;

public class ApiException: Exception
{
    public ApiException(
        HttpStatusCode code, 
        string message
    ): base(message) {
        StatusCode = code;
    }
    public HttpStatusCode StatusCode { get; private set; }
}