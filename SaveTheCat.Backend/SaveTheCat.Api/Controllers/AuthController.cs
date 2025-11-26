using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using SaveTheCat.Api.Configuration;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.Auth.Commands; // <-- Usando Comandos
using SaveTheCat.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SaveTheCat.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IOptions<JwtSettings> jwtOptions,
    IMediator mediator) : BaseApiController // Hereda para CurrentUserId
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
    private readonly JwtSettings _jwtSettings = jwtOptions.Value;
    private readonly IMediator _mediator = mediator; // <-- Inyecta MediatR

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var command = new RegisterCommand(registerDto);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { Message = "Registro exitoso. Por favor, revisa tu email para verificar tu cuenta." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        ApplicationUser? user;

        if (loginDto.EmailOrNickname.Contains('@'))
        {
            user = await _userManager.FindByEmailAsync(loginDto.EmailOrNickname);
        }
        else
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.UserName == loginDto.EmailOrNickname || u.Nickname == loginDto.EmailOrNickname);
        }

        if (user == null)
        {
            return Unauthorized(new { Message = "Email, nickname o contraseña inválidos." });
        }

        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            return Unauthorized(new { Message = "Debes verificar tu email antes de iniciar sesión." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { Message = "Email, nickname o contraseña inválidos." });
        }

        var userDto = new UserDto(user.Id, user.Email!, user.Nickname);
        var token = GenerateJwtToken(user);

        return Ok(new AuthResponseDto(token, userDto));
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            // No reveles que el usuario no existe
            return BadRequest(new { Message = "Error al verificar el email." });
        }

        var result = await _userManager.ConfirmEmailAsync(user, dto.Token);

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Error al verificar el email. El enlace puede haber caducado." });
        }

        // Si la verificación es exitosa, loguea al usuario y devuelve un token
        var userDto = new UserDto(user.Id, user.Email!, user.Nickname);
        var jwtToken = GenerateJwtToken(user);

        return Ok(new AuthResponseDto(jwtToken, userDto));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
    {
        // El controlador no sabe CÓMO se maneja esto, solo envía el comando.
        await _mediator.Send(new ForgotPasswordCommand(forgotPasswordDto.Email));

        // Por seguridad, siempre devuelve OK
        return Ok(new { Message = "Si existe una cuenta con ese email, se ha enviado un correo de recuperación." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var command = new ResetPasswordCommand(resetPasswordDto.Email, resetPasswordDto.Token, resetPasswordDto.NewPassword);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { Message = "Tu contraseña ha sido restablecida." });
    }

    [Authorize] // <-- Requiere estar logueado
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
    {
        var userId = CurrentUserId;
        if (userId is null)
        {
            return Unauthorized();
        }

        var command = new ChangePasswordCommand(userId, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { Message = "Tu contraseña ha sido cambiada." });
    }

    [Authorize]
    [HttpDelete("delete-account")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = CurrentUserId;
        if (userId is null)
        {
            return Unauthorized();
        }

        var command = new DeleteAccountCommand(userId);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { Message = "Tu cuenta y todos tus datos han sido eliminados." });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new("nickname", user.Nickname)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}