using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;

// --- Cambio de Contraseña (Autenticado) ---
public record ChangePasswordDto(
    [Required] string CurrentPassword,
    [Required] string NewPassword
);