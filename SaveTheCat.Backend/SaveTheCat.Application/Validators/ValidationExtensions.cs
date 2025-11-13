using FluentValidation;

namespace SaveTheCat.Application.Validators;

public static class ValidationExtensions
{
    public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.")
            .Matches("[A-Z]").WithMessage("La contraseña debe contener al menos una mayúscula.")
            .Matches("[a-z]").WithMessage("La contraseña debe contener al menos una minúscula.")
            .Matches("[0-9]").WithMessage("La contraseña debe contener al menos un dígito.")
            .Matches("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~]")
            .WithMessage("La contraseña debe contener al menos un caracter especial.");
    }
}