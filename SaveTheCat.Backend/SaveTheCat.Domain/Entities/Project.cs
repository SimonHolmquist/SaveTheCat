using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Domain.Entities;

// 2. Proyecto
public class Project
{
    public Guid Id { get; set; } // Usar Guid es mejor que string para IDs de BD
    [Required]
    public required string Name { get; set; }

    // Relación con el usuario
    [Required]
    public required string ApplicationUserId { get; set; }
    public virtual ApplicationUser? ApplicationUser { get; set; }

    // Relaciones: Un proyecto tiene...
    public required virtual BeatSheet BeatSheet { get; set; }
    public virtual ICollection<StickyNote> StickyNotes { get; set; } = [];
    public virtual ICollection<Character> Characters { get; set; } = [];
    public virtual ICollection<Location> Locations { get; set; } = [];
}
