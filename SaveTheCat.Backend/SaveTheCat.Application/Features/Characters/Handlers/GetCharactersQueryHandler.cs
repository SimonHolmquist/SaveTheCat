using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.Characters.Queries;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Characters.Handlers;

public class GetCharactersQueryHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetCharactersQuery, IEnumerable<EntityDto>>
{
    public async Task<IEnumerable<EntityDto>> Handle(GetCharactersQuery request, CancellationToken cancellationToken)
    {
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return [];

        return await context.Characters
            .Where(c => c.ProjectId == request.ProjectId)
            .OrderBy(c => c.Name)
            .ProjectTo<EntityDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}