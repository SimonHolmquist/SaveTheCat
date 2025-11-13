using FluentValidation;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Validators.Common;

public class UpdateEntityDtoValidator : AbstractValidator<UpdateEntityDto>
{
    public UpdateEntityDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");
    }
}