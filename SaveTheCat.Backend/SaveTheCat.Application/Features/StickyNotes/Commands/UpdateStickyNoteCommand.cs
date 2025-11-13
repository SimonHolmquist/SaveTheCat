using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.StickyNotes.Commands;

// El Comando: usa el DTO de actualización y devuelve la nota actualizada
public record UpdateStickyNoteCommand(Guid NoteId, string UserId, UpdateStickyNoteDto Dto) : IRequest<StickyNoteDto?>;
