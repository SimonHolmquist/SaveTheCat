using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Projects.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Projects.Handlers;

public class DeleteProjectCommandHandler(ApplicationDbContext context)
    : IRequestHandler<DeleteProjectCommand>
{
    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);

        if (project is not null)
        {
            context.Projects.Remove(project);
            await context.SaveChangesAsync(cancellationToken);
        }
        // Si no se encuentra, no hacemos nada (es idempotente)
    }
}