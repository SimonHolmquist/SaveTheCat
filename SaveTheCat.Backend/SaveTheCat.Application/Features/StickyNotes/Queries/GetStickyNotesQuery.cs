using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.StickyNotes.Queries;

public record GetStickyNotesQuery(Guid ProjectId, string UserId) : IRequest<IEnumerable<StickyNoteDto>>;
