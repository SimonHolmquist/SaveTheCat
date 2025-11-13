using MediatR;
using Microsoft.AspNetCore.Identity;

namespace SaveTheCat.Application.Features.Auth.Commands;

public record ChangePasswordCommand(string UserId, string CurrentPassword, string NewPassword) : IRequest<IdentityResult>;
