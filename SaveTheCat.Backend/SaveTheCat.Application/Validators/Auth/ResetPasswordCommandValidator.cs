using FluentValidation;
using SaveTheCat.Application.Features.Auth.Commands;

namespace SaveTheCat.Application.Validators.Auth;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Token)
            .NotEmpty();

        RuleFor(x => x.NewPassword)
            .Password(); // Reutilizamos la regla
    }
}