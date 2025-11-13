using FluentValidation;
using SaveTheCat.Application.Features.Projects.Commands;

namespace SaveTheCat.Application.Validators.Projects;

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.NewName)
            .NotEmpty().WithMessage("El nombre del proyecto es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");
    }
}