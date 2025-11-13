using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using SaveTheCat.Domain.Entities;
using System.Web; // Asegúrate de tener esta referencia

namespace SaveTheCat.Infrastructure.Services;

public class EmailService(IOptions<EmailSettings> emailSettings) : IEmailService
{
    private readonly EmailSettings _emailSettings = emailSettings.Value;

    public async Task SendPasswordResetEmailAsync(ApplicationUser user, string token)
    {
        // El token de Identity ya viene codificado para URL, pero el email no.
        var encodedEmail = HttpUtility.UrlEncode(user.Email);
        var encodedToken = HttpUtility.UrlEncode(token);

        // Construye el enlace que irá en el correo.
        // Apunta a tu frontend de React, pasándole el token y el email.
        var resetLink = $"{_emailSettings.ClientAppUrl}/reset-password?token={encodedToken}&email={encodedEmail}";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.SmtpUser));
        message.To.Add(new MailboxAddress(user.Nickname, user.Email));
        message.Subject = "Restablece tu contraseña de Save The Cat";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <p>Hola {user.Nickname},</p>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                <p><a href='{resetLink}'>Restablecer mi contraseña</a></p>
                <p>Si no solicitaste esto, puedes ignorar este correo.</p>
                <p>Gracias,<br>El equipo de Save The Cat</p>"
        };

        using var client = new SmtpClient();
        // Conectar de forma segura (STARTTLS)
        await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);

        // Autenticarse
        await client.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPass);

        // Enviar
        await client.SendAsync(message);

        // Desconectar
        await client.DisconnectAsync(true);
    }

    public async Task SendVerificationEmailAsync(ApplicationUser user, string token)
    {
        var encodedEmail = HttpUtility.UrlEncode(user.Email);
        var encodedToken = HttpUtility.UrlEncode(token);

        // Apunta a la nueva ruta del frontend que crearemos
        var verificationLink = $"{_emailSettings.ClientAppUrl}/verify-email-confirm?token={encodedToken}&email={encodedEmail}";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.SmtpUser));
        message.To.Add(new MailboxAddress(user.Nickname, user.Email));
        message.Subject = "¡Bienvenido a Save The Cat! Verifica tu correo";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <p>Hola {user.Nickname},</p>
                <p>Gracias por registrarte en Save The Cat. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
                <p><a href='{verificationLink}'>Verificar mi correo</a></p>
                <p>¡Nos vemos dentro!</p>"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}