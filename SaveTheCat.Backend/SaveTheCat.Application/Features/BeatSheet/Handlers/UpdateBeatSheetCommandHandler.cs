using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.BeatSheet.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.BeatSheet.Handlers;

public class UpdateBeatSheetCommandHandler(ApplicationDbContext context)
    : IRequestHandler<UpdateBeatSheetCommand>
{
    public async Task Handle(UpdateBeatSheetCommand request, CancellationToken cancellationToken)
    {
        var beatSheet = await context.BeatSheets
            .Include(b => b.Project)
            .FirstOrDefaultAsync(
                b => b.ProjectId == request.ProjectId && b.Project != null && b.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        if (beatSheet is null) return;

        // Mapeo manual (AutoMapper es más complejo para actualizar un objeto existente)
        var dto = request.Dto;
        beatSheet.Logline = dto.Logline;
        beatSheet.Genre = dto.Genre;
        beatSheet.OpeningImage = dto.OpeningImage;
        beatSheet.ThemeStated = dto.ThemeStated;
        beatSheet.SetUp = dto.SetUp;
        beatSheet.Catalyst = dto.Catalyst;
        beatSheet.Debate = dto.Debate;
        beatSheet.BreakIntoTwo = dto.BreakIntoTwo;
        beatSheet.BStory = dto.BStory;
        beatSheet.FunAndGames = dto.FunAndGames;
        beatSheet.Midpoint = dto.Midpoint;
        beatSheet.BadGuysCloseIn = dto.BadGuysCloseIn;
        beatSheet.AllIsLost = dto.AllIsLost;
        beatSheet.DarkNightOfTheSoul = dto.DarkNightOfTheSoul;
        beatSheet.BreakIntoThree = dto.BreakIntoThree;
        beatSheet.Finale = dto.Finale;
        beatSheet.FinalImage = dto.FinalImage;

        await context.SaveChangesAsync(cancellationToken);
    }
}