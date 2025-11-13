using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Projects.Commands;

// EL COMMAND: datos para crear un proyecto. Devuelve el nuevo ProjectDto.
public record CreateProjectCommand(string Name, string UserId) : IRequest<ProjectDto>;

