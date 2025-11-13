using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.StickyNotes.Queries;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.StickyNotes.Handlers;

public class GetStickyNotesQueryHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetStickyNotesQuery, IEnumerable<StickyNoteDto>>
{
    public async Task<IEnumerable<StickyNoteDto>> Handle(GetStickyNotesQuery request, CancellationToken cancellationToken)
    {
        // Valida la propiedad del proyecto antes de devolver notas
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return Enumerable.Empty<StickyNoteDto>();

        return await context.StickyNotes
            .Where(n => n.ProjectId == request.ProjectId)
            .ProjectTo<StickyNoteDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}