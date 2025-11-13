using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Characters.Commands;

public record CreateCharacterCommand(Guid ProjectId, string UserId, string Name) : IRequest<EntityDto?>;
