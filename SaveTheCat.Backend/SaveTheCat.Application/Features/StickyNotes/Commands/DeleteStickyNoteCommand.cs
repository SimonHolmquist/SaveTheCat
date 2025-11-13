using MediatR;

namespace SaveTheCat.Application.Features.StickyNotes.Commands;

// El Comando: solo necesita el ID de la nota y el ID del usuario
public record DeleteStickyNoteCommand(Guid NoteId, string UserId) : IRequest;
