using MediatR;
using Microsoft.AspNetCore.Identity;

namespace SaveTheCat.Application.Features.Auth.Commands;

public record DeleteAccountCommand(string UserId) : IRequest<IdentityResult>;