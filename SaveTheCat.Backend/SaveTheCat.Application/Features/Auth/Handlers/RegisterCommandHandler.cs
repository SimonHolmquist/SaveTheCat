using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using SaveTheCat.Application.Features.Auth.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Services;

namespace SaveTheCat.Application.Features.Auth.Handlers;

public class RegisterCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailService, ILogger<RegisterCommandHandler> logger)
    : IRequestHandler<RegisterCommand, IdentityResult>
{
    public async Task<IdentityResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Dto.Email;

        logger.LogInformation("Creating user with email {Email}", email);

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Nickname = request.Dto.Nickname
        };

        var result = await userManager.CreateAsync(user, request.Dto.Password);

        if (!result.Succeeded)
        {
            logger.LogWarning("Failed to create user {Email}. Errors: {Errors}",
                email,
                string.Join("; ", result.Errors.Select(e => e.Description)));

            return result;
        }

        try
        {
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            await emailService.SendVerificationEmailAsync(user, token);

            logger.LogInformation("Verification email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error sending verification email to {Email}", email);
            // Opcional: seguir devolviendo Success pero ya tenés trazado el problema de email
        }

        return result;
    }
}