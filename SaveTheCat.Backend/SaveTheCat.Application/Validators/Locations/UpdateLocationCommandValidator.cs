using FluentValidation;
using SaveTheCat.Application.Features.Locations.Commands;
using SaveTheCat.Application.Validators.Common; // <-- Reutilizamos el validador

namespace SaveTheCat.Application.Validators.Locations;

public class UpdateLocationCommandValidator : AbstractValidator<UpdateLocationCommand>
{
    public UpdateLocationCommandValidator()
    {
        RuleFor(x => x.LocationId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        // Valida el DTO anidado
        RuleFor(x => x.Dto).NotNull().SetValidator(new UpdateEntityDtoValidator());
    }
}