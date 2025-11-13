namespace SaveTheCat.Application.Dtos;

public record AuthResponseDto(
    string Token,
    UserDto User
);
