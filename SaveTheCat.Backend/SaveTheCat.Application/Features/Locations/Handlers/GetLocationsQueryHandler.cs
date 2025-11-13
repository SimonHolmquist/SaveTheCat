using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Locations.Queries;
using SaveTheCat.Infrastructure.Data;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Locations.Handlers;

public class GetLocationsQueryHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetLocationsQuery, IEnumerable<EntityDto>>
{
    public async Task<IEnumerable<EntityDto>> Handle(GetLocationsQuery request, CancellationToken cancellationToken)
    {
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return [];

        return await context.Locations
            .Where(l => l.ProjectId == request.ProjectId)
            .OrderBy(l => l.Name)
            .ProjectTo<EntityDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}