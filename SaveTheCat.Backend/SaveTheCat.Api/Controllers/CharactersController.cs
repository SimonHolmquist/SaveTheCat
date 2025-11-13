using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.Characters.Commands;
using SaveTheCat.Application.Features.Characters.Queries;

namespace SaveTheCat.Api.Controllers;

[Authorize]
[Route("api/projects/{projectId}/characters")]
public class CharactersController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EntityDto>>> GetCharacters(Guid projectId)
    {
        var query = new GetCharactersQuery(projectId, CurrentUserId!);
        var characters = await _mediator.Send(query);
        return Ok(characters);
    }

    [HttpPost]
    public async Task<ActionResult<EntityDto>> CreateCharacter(Guid projectId, [FromBody] CreateEntityDto createDto)
    {
        var command = new CreateCharacterCommand(projectId, CurrentUserId!, createDto.Name);
        var entityDto = await _mediator.Send(command);

        return entityDto is not null
            ? CreatedAtAction(nameof(GetCharacters), new { projectId, id = entityDto.Id }, entityDto)
            : Forbid();
    }

    [HttpPut("{characterId}")]
    public async Task<IActionResult> UpdateCharacter(Guid characterId, [FromBody] UpdateEntityDto updateDto)
    {
        var command = new UpdateCharacterCommand(characterId, CurrentUserId!, updateDto);
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{characterId}")]
    public async Task<IActionResult> DeleteCharacter(Guid characterId)
    {
        var command = new DeleteCharacterCommand(characterId, CurrentUserId!);
        await _mediator.Send(command);
        return NoContent();
    }
}