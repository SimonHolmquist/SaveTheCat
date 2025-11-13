using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class DeleteAccountCommandHandler(UserManager<ApplicationUser> userManager)
    : IRequestHandler<DeleteAccountCommand, IdentityResult>
{
    public async Task<IdentityResult> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Usuario no encontrado." });
        }

        // EF Core eliminará en cascada todos los Proyectos, BeatSheets, Notas, etc.
        // gracias a la configuración de tu DbContext.
        return await userManager.DeleteAsync(user);
    }
}