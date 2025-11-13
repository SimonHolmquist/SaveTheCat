using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.BeatSheet.Commands;

// Usamos el DTO directamente en el comando para evitar mapeo manual
public record UpdateBeatSheetCommand(Guid ProjectId, string UserId, UpdateBeatSheetDto Dto) : IRequest;
