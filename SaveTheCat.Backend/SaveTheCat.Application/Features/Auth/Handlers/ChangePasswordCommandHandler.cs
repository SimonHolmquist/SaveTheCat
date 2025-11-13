using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class ChangePasswordCommandHandler(UserManager<ApplicationUser> userManager)
    : IRequestHandler<ChangePasswordCommand, IdentityResult>
{
    public async Task<IdentityResult> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Usuario no encontrado." });
        }

        return await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
    }
}