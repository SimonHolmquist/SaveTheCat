using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class ResetPasswordCommandHandler(UserManager<ApplicationUser> userManager)
    : IRequestHandler<ResetPasswordCommand, IdentityResult>
{
    public async Task<IdentityResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Usuario no encontrado." });
        }

        return await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
    }
}