using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;
public record RegisterDto(
    [Required][EmailAddress] string Email,
    [Required][StringLength(50, MinimumLength = 3)] string Nickname,
    [Required] string Password
);
