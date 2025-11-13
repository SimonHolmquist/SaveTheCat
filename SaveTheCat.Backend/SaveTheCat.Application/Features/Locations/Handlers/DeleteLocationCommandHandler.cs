using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Locations.Handlers;

public class DeleteLocationCommandHandler(ApplicationDbContext context)
    : IRequestHandler<DeleteLocationCommand>
{
    public async Task Handle(DeleteLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await context.Locations
            .Include(l => l.Project)
            .FirstOrDefaultAsync(
                l => l.Id == request.LocationId && l.Project != null && l.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        if (location is not null)
        {
            context.Locations.Remove(location);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}