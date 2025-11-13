using FluentValidation;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.BeatSheet.Commands;

namespace SaveTheCat.Application.Validators.BeatSheet;

// Validador para el DTO interno
public class UpdateBeatSheetDtoValidator : AbstractValidator<UpdateBeatSheetDto>
{
    public UpdateBeatSheetDtoValidator()
    {
        // Tu entidad 'BeatSheet' marca estos como 'required string'.
        // 'NotNull' permite strings vacíos (""), pero no nulos.
        RuleFor(x => x.Logline).NotNull();
        RuleFor(x => x.Genre).NotNull();
        RuleFor(x => x.OpeningImage).NotNull();
        RuleFor(x => x.ThemeStated).NotNull();
        RuleFor(x => x.SetUp).NotNull();
        RuleFor(x => x.Catalyst).NotNull();
        RuleFor(x => x.Debate).NotNull();
        RuleFor(x => x.BreakIntoTwo).NotNull();
        RuleFor(x => x.BStory).NotNull();
        RuleFor(x => x.FunAndGames).NotNull();
        RuleFor(x => x.Midpoint).NotNull();
        RuleFor(x => x.BadGuysCloseIn).NotNull();
        RuleFor(x => x.AllIsLost).NotNull();
        RuleFor(x => x.DarkNightOfTheSoul).NotNull();
        RuleFor(x => x.BreakIntoThree).NotNull();
        RuleFor(x => x.Finale).NotNull();
        RuleFor(x => x.FinalImage).NotNull();
    }
}

// Validador para el Comando que envuelve al DTO
public class UpdateBeatSheetCommandValidator : AbstractValidator<UpdateBeatSheetCommand>
{
    public UpdateBeatSheetCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        // Ejecuta el validador del DTO anidado
        RuleFor(x => x.Dto).NotNull().SetValidator(new UpdateBeatSheetDtoValidator());
    }
}