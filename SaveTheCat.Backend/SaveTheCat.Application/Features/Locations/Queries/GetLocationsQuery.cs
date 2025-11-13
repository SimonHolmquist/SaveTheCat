using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Locations.Queries;

public record GetLocationsQuery(Guid ProjectId, string UserId) : IRequest<IEnumerable<EntityDto>>;
