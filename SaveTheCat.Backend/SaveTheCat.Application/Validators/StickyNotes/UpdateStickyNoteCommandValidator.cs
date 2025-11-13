using FluentValidation;
using SaveTheCat.Application.Features.StickyNotes.Commands;

namespace SaveTheCat.Application.Validators.StickyNotes;

public class UpdateStickyNoteCommandValidator : AbstractValidator<UpdateStickyNoteCommand>
{
    public UpdateStickyNoteCommandValidator()
    {
        RuleFor(x => x.NoteId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Dto).NotNull().SetValidator(new UpdateStickyNoteDtoValidator());
    }
}