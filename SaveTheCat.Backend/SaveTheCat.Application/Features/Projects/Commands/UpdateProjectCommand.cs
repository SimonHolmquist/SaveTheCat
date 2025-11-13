using MediatR;

namespace SaveTheCat.Application.Features.Projects.Commands;

// EL COMMAND: no devuelve nada (Unit)
public record UpdateProjectCommand(Guid ProjectId, string NewName, string UserId) : IRequest;
