using MediatR;
using SaveTheCat.Application.Dtos;


namespace SaveTheCat.Application.Features.StickyNotes.Commands;

// El Comando: usa el DTO específico de posición
public record UpdateNotePositionCommand(Guid NoteId, string UserId, UpdateNotePositionDto Dto) : IRequest;
