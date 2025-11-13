using FluentValidation;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Validators.StickyNotes;

public class UpdateStickyNoteDtoValidator : AbstractValidator<UpdateStickyNoteDto>
{
    public UpdateStickyNoteDtoValidator()
    {
        // Basado en tu entidad StickyNote.cs
        RuleFor(x => x.SceneHeading).NotNull();
        RuleFor(x => x.Description).NotNull();
        RuleFor(x => x.EmotionalCharge).NotNull();
        RuleFor(x => x.EmotionalDescription).NotNull();
        RuleFor(x => x.Conflict).NotNull();
        RuleFor(x => x.Color).NotEmpty();
    }
}