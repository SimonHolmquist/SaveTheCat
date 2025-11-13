namespace SaveTheCat.Application.Dtos;

// DTO para enviar en una lista o como respuesta
public record ProjectDto(
    Guid Id,
    string Name
);
