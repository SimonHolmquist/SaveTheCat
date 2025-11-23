using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

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

        // Respeta el entorno solicitado (por defecto Production) y carga los archivos de configuración
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .Build();

        // Crea las opciones del DbContext
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Lee la connection string (priorizando variables de entorno)
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? Environment.GetEnvironmentVariable("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("No se encontró la 'DefaultConnection' en los archivos de configuración ni en las variables de entorno.");
        }

        builder.UseSqlServer(connectionString);

        // Devuelve una nueva instancia del DbContext
        return new ApplicationDbContext(builder.Options);
    }
}