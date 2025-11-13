using FluentValidation;
using SaveTheCat.Application.Features.Auth.Commands;

namespace SaveTheCat.Application.Validators.Auth;

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("La contraseña actual es obligatoria.");

        RuleFor(x => x.NewPassword)
            .Password()
            .NotEqual(x => x.CurrentPassword).WithMessage("La nueva contraseña no puede ser igual a la actual.");
    }
}