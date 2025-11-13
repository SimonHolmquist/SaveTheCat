using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Characters.Queries;

public record GetCharactersQuery(Guid ProjectId, string UserId) : IRequest<IEnumerable<EntityDto>>;
