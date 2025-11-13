using MediatR;

namespace SaveTheCat.Application.Features.Auth.Commands;

// Devuelve el token de reseteo (para enviar por email)
public record ForgotPasswordCommand(string Email) : IRequest<Unit>;
