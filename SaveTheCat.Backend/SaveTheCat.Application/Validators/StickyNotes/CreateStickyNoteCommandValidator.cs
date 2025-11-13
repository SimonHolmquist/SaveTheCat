using FluentValidation;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.StickyNotes.Commands;

namespace SaveTheCat.Application.Validators.StickyNotes;

// Validador para el DTO
public class CreateStickyNoteDtoValidator : AbstractValidator<CreateStickyNoteDto>
{
    public CreateStickyNoteDtoValidator()
    {
        // Basado en la entidad StickyNote.cs
        RuleFor(x => x.SceneHeading).NotNull();
        RuleFor(x => x.Description).NotNull();
        RuleFor(x => x.EmotionalCharge).NotNull();
        RuleFor(x => x.EmotionalDescription).NotNull();
        RuleFor(x => x.Conflict).NotNull();
        RuleFor(x => x.Color).NotEmpty();
    }
}

// Validador para el Comando
public class CreateStickyNoteCommandValidator : AbstractValidator<CreateStickyNoteCommand>
{
    public CreateStickyNoteCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Dto).NotNull().SetValidator(new CreateStickyNoteDtoValidator());
    }
}