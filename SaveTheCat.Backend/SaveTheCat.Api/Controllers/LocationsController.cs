using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Application.Features.Locations.Queries;

namespace SaveTheCat.Api.Controllers;

[Authorize]
[Route("api/projects/{projectId}/locations")]
public class LocationsController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EntityDto>>> GetLocations(Guid projectId)
    {
        var query = new GetLocationsQuery(projectId, CurrentUserId!);
        var locations = await _mediator.Send(query);
        return Ok(locations);
    }

    [HttpPost]
    public async Task<ActionResult<EntityDto>> CreateLocation(Guid projectId, [FromBody] CreateEntityDto createDto)
    {
        var command = new CreateLocationCommand(projectId, CurrentUserId!, createDto);
        var entityDto = await _mediator.Send(command);

        return entityDto is not null
            ? CreatedAtAction(nameof(GetLocations), new { projectId, id = entityDto.Id }, entityDto)
            : Forbid();
    }

    [HttpPut("{locationId}")]
    public async Task<IActionResult> UpdateLocation(Guid locationId, [FromBody] UpdateEntityDto updateDto)
    {
        var command = new UpdateLocationCommand(locationId, CurrentUserId!, updateDto);
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{locationId}")]
    public async Task<IActionResult> DeleteLocation(Guid locationId)
    {
        var command = new DeleteLocationCommand(locationId, CurrentUserId!);
        await _mediator.Send(command);
        return NoContent();
    }
}