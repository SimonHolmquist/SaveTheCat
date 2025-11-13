using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Infrastructure.Services;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(ApplicationUser user, string token);
    Task SendVerificationEmailAsync(ApplicationUser user, string token);
}