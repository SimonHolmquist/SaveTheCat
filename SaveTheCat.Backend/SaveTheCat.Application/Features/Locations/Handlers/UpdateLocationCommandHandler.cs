using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Locations.Handlers;

public class UpdateLocationCommandHandler(ApplicationDbContext context)
    : IRequestHandler<UpdateLocationCommand>
{
    public async Task Handle(UpdateLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await context.Locations
            .Include(l => l.Project)
            .FirstOrDefaultAsync(l => l.Id == request.LocationId && l.Project != null && l.Project.ApplicationUserId == request.UserId, cancellationToken);

        if (location is not null)
        {
            location.Name = request.Dto.Name.ToUpper();
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}