using Microsoft.Extensions.Options;
using SaveTheCat.Domain.Entities;
using Azure.Communication.Email;
using System.Web;

namespace SaveTheCat.Infrastructure.Services;

public class EmailService(IOptions<EmailSettings> emailSettings) : IEmailService
{
    private readonly EmailSettings _emailSettings = emailSettings.Value;

    public async Task SendPasswordResetEmailAsync(ApplicationUser user, string token)
    {
        var client = new EmailClient(_emailSettings.CommunicationServiceConnectionString);

        var encodedEmail = HttpUtility.UrlEncode(user.Email);
        var encodedToken = HttpUtility.UrlEncode(token);
        var resetLink = $"{_emailSettings.ClientAppUrl}/reset-password?token={encodedToken}&email={encodedEmail}";

        var emailContent = new EmailContent("Restablece tu contraseña de Save The Cat")
        {
            Html = $@"
                <html>
                    <body>
                        <h1>Hola {user.Nickname},</h1>
                        <p>Has solicitado restablecer tu contraseña. Haz clic abajo:</p>
                        <p><a href='{resetLink}'>Restablecer mi contraseña</a></p>
                    </body>
                </html>"
        };

        var emailMessage = new EmailMessage(
            senderAddress: _emailSettings.SenderAddress,
            content: emailContent,
            recipients: new EmailRecipients([new EmailAddress(user.Email)]));

        await client.SendAsync(Azure.WaitUntil.Completed, emailMessage);
    }

    public async Task SendVerificationEmailAsync(ApplicationUser user, string token)
    {
        var client = new EmailClient(_emailSettings.CommunicationServiceConnectionString);

        var encodedEmail = HttpUtility.UrlEncode(user.Email);
        var encodedToken = HttpUtility.UrlEncode(token);
        var verificationLink = $"{_emailSettings.ClientAppUrl}/verify-email-confirm?token={encodedToken}&email={encodedEmail}";

        var emailContent = new EmailContent("¡Bienvenido! Verifica tu correo")
        {
            Html = $@"
                <html>
                    <body>
                        <h1>Hola {user.Nickname},</h1>
                        <p>Gracias por registrarte. Verifica tu cuenta aquí:</p>
                        <p><a href='{verificationLink}'>Verificar mi correo</a></p>
                    </body>
                </html>"
        };

        var emailMessage = new EmailMessage(
            senderAddress: _emailSettings.SenderAddress,
            content: emailContent,
            recipients: new EmailRecipients([new EmailAddress(user.Email)]));

        await client.SendAsync(Azure.WaitUntil.Completed, emailMessage);
    }
}