using System.Net;
using LeiaApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LeiaApi;

public class ResponseExceptionFilter: IActionFilter, IOrderedFilter
{
    private ILogger<ResponseExceptionFilter> _log;
    public ResponseExceptionFilter(
        ILogger<ResponseExceptionFilter> logger
    ) {
        _log = logger;
    }
    public int Order => int.MaxValue;
    public void OnActionExecuting(ActionExecutingContext context) 
    { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception is not null)
        {
            _log.LogError(
                "Error while processing request. Message: {message}", 
                context.Exception.Message
            );
            context.Result = new ObjectResult(new StdError() {
                Message = "Internal server exception: " + context.Exception.Message,
                StatusCode = HttpStatusCode.InternalServerError        
            })
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };

            context.ExceptionHandled = true;
        }
    }

}