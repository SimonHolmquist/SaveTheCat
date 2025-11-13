using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.BeatSheet.Commands;
using SaveTheCat.Application.Features.BeatSheet.Queries;

namespace SaveTheCat.Api.Controllers;

[Authorize]
[Route("api/projects/{projectId}/beatsheet")] // <-- Ruta anidada
public class BeatSheetController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<BeatSheetDto>> GetBeatSheet(Guid projectId)
    {
        var query = new GetBeatSheetQuery(projectId, CurrentUserId!);
        var beatSheet = await _mediator.Send(query);

        return beatSheet is not null ? Ok(beatSheet) : NotFound();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBeatSheet(Guid projectId, UpdateBeatSheetDto updateDto)
    {
        var command = new UpdateBeatSheetCommand(projectId, CurrentUserId!, updateDto);
        await _mediator.Send(command);

        return NoContent();
    }
}