using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.Characters.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Characters.Handlers;

// El Handler:
public class DeleteCharacterCommandHandler(ApplicationDbContext context)
    : IRequestHandler<DeleteCharacterCommand>
{
    public async Task Handle(DeleteCharacterCommand request, CancellationToken cancellationToken)
    {
        var character = await context.Characters
            .Include(c => c.Project)
            .FirstOrDefaultAsync(
                c => c.Id == request.CharacterId && c.Project != null && c.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        if (character is not null)
        {
            context.Characters.Remove(character);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}