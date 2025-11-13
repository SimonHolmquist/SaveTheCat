using FluentValidation;
using SaveTheCat.Application.Features.Characters.Commands;

namespace SaveTheCat.Application.Validators.Characters;

public class CreateCharacterCommandValidator : AbstractValidator<CreateCharacterCommand>
{
    public CreateCharacterCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        // El CreateCharacterCommand usa "Name" directamente, no un DTO
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");
    }
}