using MediatR;

namespace SaveTheCat.Application.Features.Characters.Commands;

// El Comando:
public record DeleteCharacterCommand(Guid CharacterId, string UserId) : IRequest;
