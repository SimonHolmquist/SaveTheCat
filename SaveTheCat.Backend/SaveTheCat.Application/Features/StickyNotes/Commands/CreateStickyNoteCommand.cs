using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.StickyNotes.Commands;

public record CreateStickyNoteCommand(Guid ProjectId, string UserId, CreateStickyNoteDto Dto) : IRequest<StickyNoteDto?>;
