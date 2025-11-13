using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Data;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Locations.Handlers;

public class CreateLocationCommandHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateLocationCommand, EntityDto?>
{
    public async Task<EntityDto?> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
    {
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return null;

        var location = new Location
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            Name = request.Dto.Name.ToUpper()
        };

        context.Locations.Add(location);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<EntityDto>(location);
    }
}