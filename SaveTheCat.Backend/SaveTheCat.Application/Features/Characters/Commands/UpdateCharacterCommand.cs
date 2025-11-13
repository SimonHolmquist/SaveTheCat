using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Characters.Commands;

// El Comando: usa el DTO de actualización
public record UpdateCharacterCommand(Guid CharacterId, string UserId, UpdateEntityDto Dto) : IRequest;
