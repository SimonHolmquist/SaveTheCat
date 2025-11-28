namespace SaveTheCat.Api.Middlewares;

public class ErrorHandlingMiddleware(RequestDelegate next,
                               ILogger<ErrorHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger = logger;

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var traceId = context.TraceIdentifier;

            _logger.LogError(ex,
                "Unhandled exception. TraceId: {TraceId}, Path: {Path}",
                traceId,
                context.Request.Path);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var payload = new
            {
                error = "Internal Server Error",
                traceId
            };

            await context.Response.WriteAsJsonAsync(payload);
        }
    }
}
