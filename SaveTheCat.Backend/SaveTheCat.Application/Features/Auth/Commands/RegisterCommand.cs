using MediatR;
using Microsoft.AspNetCore.Identity;
using SaveTheCat.Application.Dtos;

namespace SaveTheCat.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterDto Dto) : IRequest<IdentityResult>;