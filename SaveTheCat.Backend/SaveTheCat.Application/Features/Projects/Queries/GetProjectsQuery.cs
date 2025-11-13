using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Projects.Queries;

/// <summary>
/// Query para obtener todos los proyectos de un usuario específico.
/// </summary>
/// <param name="UserId">El ID del usuario autenticado.</param>
public record GetProjectsQuery(string UserId) : IRequest<IEnumerable<ProjectDto>>;