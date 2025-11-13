using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;

public record ResetPasswordDto(
    [Required][EmailAddress] string Email,
    [Required] string Token,
    [Required] string NewPassword
);
