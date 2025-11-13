using FluentValidation;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Validators.Auth;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.EmailOrNickname)
            .NotEmpty().WithMessage("El email o nickname es obligatorio.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria.");
    }
}