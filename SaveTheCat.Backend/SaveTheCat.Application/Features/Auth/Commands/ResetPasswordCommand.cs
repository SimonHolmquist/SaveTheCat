using MediatR;
using Microsoft.AspNetCore.Identity;

namespace SaveTheCat.Application.Features.Auth.Commands;

// Devuelve el resultado de Identity
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<IdentityResult>;
