using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Services;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class ForgotPasswordCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailService)
    : IRequestHandler<ForgotPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unit.Value; // No reveles que el usuario no existe
        }

        // Genera el token que se enviará por email
        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        await emailService.SendPasswordResetEmailAsync(user, token);

        return Unit.Value; // Devuelves Unit porque el handler retorna Unit
    }
}