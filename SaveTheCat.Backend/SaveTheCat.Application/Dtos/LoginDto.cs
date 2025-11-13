using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Application.Dtos;

public record LoginDto(
    [Required] string EmailOrNickname,
    [Required] string Password
);
