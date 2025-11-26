using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SaveTheCat.Infrastructure.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables() // This extension method is in Microsoft.Extensions.Configuration.EnvironmentVariables
            .Build();

        var connectionString =
            TryGetConnectionStringFromArgs(args) ??
            configuration.GetConnectionString("DefaultConnection") ??
            configuration["DefaultConnection"];
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static string? TryGetConnectionStringFromArgs(string[] args)
    {
        for (var i = 0; i < args.Length; i++)
        {
            var arg = args[i];
            if (arg.StartsWith("--connection", StringComparison.OrdinalIgnoreCase) ||
                arg.Equals("-c", StringComparison.OrdinalIgnoreCase))
            {
                var value = ExtractValue(arg, args, i);
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value;
                }
            }
        }

        return null;
    }

    private static string? ExtractValue(string currentArg, string[] args, int index)
    {
        if (currentArg.Contains('='))
        {
            var split = currentArg.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
            if (split.Length == 2)
            {
                return split[1];
            }
        }
        else if (index + 1 < args.Length)
        {
            return args[index + 1];
        }

        return null;
    }
}
