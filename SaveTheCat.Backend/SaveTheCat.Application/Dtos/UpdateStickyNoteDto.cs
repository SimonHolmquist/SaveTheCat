namespace SaveTheCat.Application.Dtos;

// DTO para Actualizar una StickyNote
// (Id viene de la URL, ProjectId es para validación)
public record UpdateStickyNoteDto(
    double X,
    double Y,
    string SceneHeading,
    string Description,
    string EmotionalCharge,
    string EmotionalDescription,
    string Conflict,
    string Color
);
