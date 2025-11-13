using FluentValidation;
using SaveTheCat.Application.Features.Auth.Commands;

namespace SaveTheCat.Application.Validators.Auth;

public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es obligatorio.")
            .EmailAddress().WithMessage("El email no es válido.");
    }
}