using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SaveTheCat.Infrastructure.Data;
using System.IO;

namespace SaveTheCat.Infrastructure.Data;

/// <summary>
/// Esta clase es usada por las herramientas 'dotnet ef' (como para crear migraciones)
/// para instanciar el DbContext en "Design Time" (tiempo de diseño).
/// Lee la connection string directamente desde el appsettings.Development.json del proyecto Api.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Obtiene la ruta al proyecto Api (asumiendo que este archivo está en Infrastructure)
        string apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "../SaveTheCat.Api");

        // Construye un IConfiguration para leer el appsettings.
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile("appsettings.Development.json")
            .Build();

        // Crea las opciones del DbContext
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Lee la connection string
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("No se encontró la 'DefaultConnection' en appsettings.Development.json.");
        }

        builder.UseSqlServer(connectionString);

        // Devuelve una nueva instancia del DbContext
        return new ApplicationDbContext(builder.Options);
    }
}