using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Services;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class RegisterCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailService)
    : IRequestHandler<RegisterCommand, IdentityResult>
{
    public async Task<IdentityResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new ApplicationUser
        {
            UserName = request.Dto.Email,
            Email = request.Dto.Email,
            Nickname = request.Dto.Nickname
        };

        var result = await userManager.CreateAsync(user, request.Dto.Password);

        if (result.Succeeded)
        {
            // Si se crea con éxito, genera el token y envía el correo
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            await emailService.SendVerificationEmailAsync(user, token);
        }

        return result;
    }
}