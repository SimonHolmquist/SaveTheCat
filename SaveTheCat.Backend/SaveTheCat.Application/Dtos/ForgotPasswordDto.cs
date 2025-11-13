using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;

// --- Recuperación de Contraseña ---
public record ForgotPasswordDto(
    [Required][EmailAddress] string Email
);
