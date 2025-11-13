using MediatR;

using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.StickyNotes.Commands;

// El Comando: usa el DTO específico de color
public record UpdateNoteColorCommand(Guid NoteId, string UserId, UpdateNoteColorDto Dto) : IRequest;
