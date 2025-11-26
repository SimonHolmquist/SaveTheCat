using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SaveTheCat.Application.Common.Behaviors;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure;
using SaveTheCat.Infrastructure.Data;
using SaveTheCat.Infrastructure.Services;
using System.Text;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

var appAssembly = typeof(SaveTheCat.Application.Common.Mappings.MappingProfile).Assembly;
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(appAssembly));
builder.Services.AddValidatorsFromAssembly(appAssembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddAutoMapper(cfg => { }, appAssembly);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?.Where(origin => !string.IsNullOrWhiteSpace(origin))
    .ToArray();

// Ensure allowedOrigins is not null or empty before using it in WithOrigins
if (allowedOrigins == null || allowedOrigins.Length == 0)
{
    throw new InvalidOperationException("AllowedOrigins is not configured. Please set 'Cors:AllowedOrigins' in your configuration.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientApp",
        policy => policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

// 2. Conectar la Base de Datos y el DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)); // O UseNpgsql, UseSqlite

// 3. Configurar .NET Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders(); // Importante para la recuperación de contraseña

// 4. Configurar Autenticación con JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty)
        )
    };
});

builder.Services.AddControllers();
builder.Services.AddSwaggerGen(options =>
{
    // Define el esquema de seguridad (JWT Bearer)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Introduce 'Bearer' [espacio] y luego tu token. Ejemplo: 'Bearer 12345abcdef'"
    });

    // Requiere que los endpoints usen esta seguridad
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurrió un error al migrar la base de datos.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowClientApp"); // Aplicar la política CORS
app.UseAuthentication(); // Primero autentica
app.UseAuthorization(); // Luego autoriza

app.MapControllers();
app.Run();