using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SaveTheCat.Domain.Entities;

// En SaveTheCat.Domain/Entities

// 1. Usuario (usando .NET Identity)
// Agregamos Nickname al usuario de Identity
public class ApplicationUser : IdentityUser
{
    [Required]
    [StringLength(50)]
    public required string Nickname { get; set; }

    // Relación: Un usuario tiene muchos proyectos
    public virtual ICollection<Project> Projects { get; set; } = [];
}
