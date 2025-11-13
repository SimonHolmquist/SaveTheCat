using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.StickyNotes.Commands;
using SaveTheCat.Application.Features.StickyNotes.Queries;

namespace SaveTheCat.Api.Controllers;

[Authorize]
[Route("api/projects/{projectId}/notes")]
public class StickyNotesController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StickyNoteDto>>> GetNotes(Guid projectId)
    {
        var query = new GetStickyNotesQuery(projectId, CurrentUserId!);
        var notes = await _mediator.Send(query);
        return Ok(notes);
    }

    [HttpPost]
    public async Task<ActionResult<StickyNoteDto>> CreateNote(Guid projectId, [FromBody] CreateStickyNoteDto createNoteDto)
    {
        var command = new CreateStickyNoteCommand(projectId, CurrentUserId!, createNoteDto);
        var noteDto = await _mediator.Send(command);

        return noteDto is not null
            ? CreatedAtAction(nameof(GetNotes), new { projectId, id = noteDto.Id }, noteDto)
            : Forbid(); // O BadRequest, si el handler valida propiedad
    }

    [HttpPut("{noteId}")]
    public async Task<ActionResult<StickyNoteDto>> UpdateNote(Guid noteId, [FromBody] UpdateStickyNoteDto updateNoteDto)
    {
        // Nota: projectId no se usa en el comando, pero está en la ruta por RESTfulness
        // El handler valida la propiedad usando el CurrentUserId y el noteId
        var command = new UpdateStickyNoteCommand(noteId, CurrentUserId!, updateNoteDto);
        var noteDto = await _mediator.Send(command);

        return noteDto is not null ? Ok(noteDto) : NotFound();
    }

    [HttpDelete("{noteId}")]
    public async Task<IActionResult> DeleteNote(Guid noteId)
    {
        var command = new DeleteStickyNoteCommand(noteId, CurrentUserId!);
        await _mediator.Send(command);
        return NoContent();
    }

    // --- Endpoints Adicionales de tu React App ---

    [HttpPatch("{noteId}/position")]
    public async Task<IActionResult> UpdateNotePosition(Guid noteId, [FromBody] UpdateNotePositionDto positionDto)
    {
        var command = new UpdateNotePositionCommand(noteId, CurrentUserId!, positionDto);
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPatch("{noteId}/color")]
    public async Task<IActionResult> UpdateNoteColor(Guid noteId, [FromBody] UpdateNoteColorDto colorDto)
    {
        var command = new UpdateNoteColorCommand(noteId, CurrentUserId!, colorDto);
        await _mediator.Send(command);
        return NoContent();
    }
}