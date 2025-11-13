using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SaveTheCat.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);
}