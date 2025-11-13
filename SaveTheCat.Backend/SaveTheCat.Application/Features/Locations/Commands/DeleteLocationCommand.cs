using MediatR;

namespace SaveTheCat.Application.Features.Locations.Commands;

public record DeleteLocationCommand(Guid LocationId, string UserId) : IRequest;
