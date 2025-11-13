using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    // Tus entidades de Dominio
    public DbSet<Project> Projects { get; set; }
    public DbSet<BeatSheet> BeatSheets { get; set; }
    public DbSet<StickyNote> StickyNotes { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Location> Locations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configuración de relaciones (ej. 1 a 1 entre Project y BeatSheet)
        builder.Entity<Project>()
            .HasOne(p => p.BeatSheet)
            .WithOne(b => b.Project)
            .HasForeignKey<BeatSheet>(b => b.ProjectId);

        // Configuración de eliminaciones en cascada
        // Si borras un Proyecto, se borran sus notas, beatsheet, etc.
        builder.Entity<Project>()
            .HasMany(p => p.StickyNotes)
            .WithOne(n => n.Project)
            .HasForeignKey(n => n.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Project>()
            .HasMany(p => p.Characters)
            .WithOne(c => c.Project)
            .HasForeignKey(c => c.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Project>()
            .HasMany(p => p.Locations)
            .WithOne(l => l.Project)
            .HasForeignKey(l => l.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}