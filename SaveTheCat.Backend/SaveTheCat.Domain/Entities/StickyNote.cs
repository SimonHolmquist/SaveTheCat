namespace SaveTheCat.Domain.Entities;

// 4. Nota Adhesiva
public class StickyNote
{
    public Guid Id { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public required string SceneHeading { get; set; }
    public required string Description { get; set; }
    public required string EmotionalCharge { get; set; }
    public required string EmotionalDescription { get; set; }
    public required string Conflict { get; set; }
    public required string Color { get; set; }
    public string BeatItem { get; set; } = string.Empty;
    // Relación con el proyecto
    public required Guid ProjectId { get; set; }
    public virtual Project? Project { get; set; }
}
