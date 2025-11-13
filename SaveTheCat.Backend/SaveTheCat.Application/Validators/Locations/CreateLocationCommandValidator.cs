using FluentValidation;
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Application.Validators.Common; // <-- Reutilizamos el validador

namespace SaveTheCat.Application.Validators.Locations;

public class CreateLocationCommandValidator : AbstractValidator<CreateLocationCommand>
{
    public CreateLocationCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        // Valida el DTO anidado
        RuleFor(x => x.Dto).NotNull().SetValidator(new CreateEntityDtoValidator());
    }
}