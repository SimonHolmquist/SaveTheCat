using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Locations.Commands;

public record UpdateLocationCommand(Guid LocationId, string UserId, UpdateEntityDto Dto) : IRequest;
