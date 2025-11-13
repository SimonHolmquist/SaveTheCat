using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Locations.Commands;

public record CreateLocationCommand(Guid ProjectId, string UserId, CreateEntityDto Dto) : IRequest<EntityDto?>;
