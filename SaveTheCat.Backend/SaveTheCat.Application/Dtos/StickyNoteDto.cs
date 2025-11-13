namespace SaveTheCat.Application.Dtos;

public record StickyNoteDto(
Guid Id,
double X,
double Y,
string SceneHeading,
string Description,
string EmotionalCharge,
string EmotionalDescription,
string Conflict,
string Color,
Guid ProjectId
);