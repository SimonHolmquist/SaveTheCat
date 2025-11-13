namespace SaveTheCat.Application.Dtos;

// DTO para Crear una StickyNote
// (Id se genera en el servidor, ProjectId viene de la URL)
public record CreateStickyNoteDto(
    double X,
    double Y,
    string SceneHeading,
    string Description,
    string EmotionalCharge,
    string EmotionalDescription,
    string Conflict,
    string Color
);
