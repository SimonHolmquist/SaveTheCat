using FluentValidation;
using SaveTheCat.Application.Features.Characters.Commands;
using SaveTheCat.Application.Validators.Common; // <-- Reutilizamos el validador

namespace SaveTheCat.Application.Validators.Characters;

public class UpdateCharacterCommandValidator : AbstractValidator<UpdateCharacterCommand>
{
    public UpdateCharacterCommandValidator()
    {
        RuleFor(x => x.CharacterId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        // Valida el DTO anidado
        RuleFor(x => x.Dto).NotNull().SetValidator(new UpdateEntityDtoValidator());
    }
}