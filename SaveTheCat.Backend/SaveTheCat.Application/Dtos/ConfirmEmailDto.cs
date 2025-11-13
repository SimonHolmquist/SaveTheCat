using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;

public record ConfirmEmailDto(
    [Required][EmailAddress] string Email,
    [Required] string Token
);