namespace SaveTheCat.Application.Dtos;

public record NoteDto(Guid Id, string Content, int PositionX, int PositionY, string? Color);
