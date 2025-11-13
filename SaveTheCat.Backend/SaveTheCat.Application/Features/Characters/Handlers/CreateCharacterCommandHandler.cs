using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos; // <-- Namespace corregido
using SaveTheCat.Application.Features.Characters.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Characters.Handlers;

public class CreateCharacterCommandHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateCharacterCommand, EntityDto?>
{
    public async Task<EntityDto?> Handle(CreateCharacterCommand request, CancellationToken cancellationToken)
    {
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return null;

        var character = new Character
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId, // <-- Solo se asigna el ID
            Name = request.Name.ToUpper(),
        };

        context.Characters.Add(character);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<EntityDto>(character);
    }
}