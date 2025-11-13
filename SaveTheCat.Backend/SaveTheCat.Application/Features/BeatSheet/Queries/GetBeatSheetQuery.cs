using MediatR;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.BeatSheet.Queries;

public record GetBeatSheetQuery(Guid ProjectId, string UserId) : IRequest<BeatSheetDto?>;
