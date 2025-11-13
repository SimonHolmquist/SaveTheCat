using AutoMapper;
using MediatR;
using SaveTheCat.Application.Dtos; // <-- Namespace corregido
using SaveTheCat.Application.Features.Projects.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Projects.Handlers;

public class CreateProjectCommandHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    public async Task<ProjectDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        // 1. Crear el Proyecto (solo se asigna el ID de usuario)
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name.ToUpper(),
            ApplicationUserId = request.UserId,
            BeatSheet = null! // <-- Inicializado más adelante
        };

        // 2. Crear la BeatSheet asociada
        var beatSheet = new Domain.Entities.BeatSheet
        {
            Id = Guid.NewGuid(),
            ProjectId = project.Id, // <-- Solo se asigna el ID del proyecto
            Title = project.Name,
            Date = DateTime.Now.ToShortDateString(),
            Logline = "",
            Genre = "",
            OpeningImage = "",
            ThemeStated = "",
            SetUp = "",
            Catalyst = "",
            Debate = "",
            BreakIntoTwo = "",
            BStory = "",
            FunAndGames = "",
            Midpoint = "",
            BadGuysCloseIn = "",
            AllIsLost = "",
            DarkNightOfTheSoul = "",
            BreakIntoThree = "",
            Finale = "",
            FinalImage = ""
        };

        // 3. Asignar la BeatSheet al proyecto
        project.BeatSheet = beatSheet;

        // 4. Agregar solo el Proyecto. EF Core guardará la BeatSheet gracias a la navegación.
        context.Projects.Add(project);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<ProjectDto>(project);
    }
}