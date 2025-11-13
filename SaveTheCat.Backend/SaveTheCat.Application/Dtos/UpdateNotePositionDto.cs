namespace SaveTheCat.Application.Dtos;

// DTO especializado para actualizar solo la posición (más eficiente)
public record UpdateNotePositionDto(
    double X,
    double Y
);
