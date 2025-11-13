using FluentValidation;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Validators.Auth;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es obligatorio.")
            .EmailAddress().WithMessage("El email no es válido.");

        RuleFor(x => x.Nickname)
            .NotEmpty().WithMessage("El nickname es obligatorio.")
            .MinimumLength(3).WithMessage("El nickname debe tener al menos 3 caracteres.")
            .MaximumLength(50).WithMessage("El nickname no debe exceder los 50 caracteres.");

        RuleFor(x => x.Password).Password(); // <-- Reutilizamos nuestra regla!
    }
}