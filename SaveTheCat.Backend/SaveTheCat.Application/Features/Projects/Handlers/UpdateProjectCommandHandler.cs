using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Projects.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Projects.Handlers;

// EL HANDLER:
public class UpdateProjectCommandHandler(ApplicationDbContext context)
    : IRequestHandler<UpdateProjectCommand>
{
    public async Task Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects
            .Include(p => p.BeatSheet) // Importante: incluir la BeatSheet
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);

        if (project is null)
        {
            // Opcional: lanzar una excepción de "NoEncontrado" o "Prohibido"
            return;
        }

        var upperName = request.NewName.ToUpper();
        project.Name = upperName;
        project.BeatSheet.Title = upperName; // Actualiza también el título en la BeatSheet

        await context.SaveChangesAsync(cancellationToken);
    }
}