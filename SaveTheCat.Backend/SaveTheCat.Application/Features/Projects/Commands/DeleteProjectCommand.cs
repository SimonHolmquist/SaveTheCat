using MediatR;

namespace SaveTheCat.Application.Features.Projects.Commands;

public record DeleteProjectCommand(Guid ProjectId, string UserId) : IRequest;
