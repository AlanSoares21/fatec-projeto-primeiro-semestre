using System.Net;
using LeiaApi.Models;
using Microsoft.AspNetCore.Http.Extensions;
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
        if (context.Exception is ApiException ex)
        {
            _log.LogError(
                "Error - Status: {st}. Message: {message}", 
                ex.StatusCode,
                ex.Message
            );
            context.Result = new ObjectResult(new StdError() {
                Message = ex.Message,
                StatusCode = ex.StatusCode
            })
            {
                StatusCode = (int)ex.StatusCode
            };

            context.ExceptionHandled = true;
        }
        else if (context.Exception is not null)
        {
            _log.LogCritical(
                "Error while processing request. \nMessage: {message}\nPath: {path}", 
                context.Exception.Message,
                context.HttpContext.Request.GetDisplayUrl()
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