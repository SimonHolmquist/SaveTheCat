using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.StickyNotes.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.StickyNotes.Handlers;

// El Handler:
public class UpdateNoteColorCommandHandler(ApplicationDbContext context)
    : IRequestHandler<UpdateNoteColorCommand>
{
    public async Task Handle(UpdateNoteColorCommand request, CancellationToken cancellationToken)
    {
        var note = await context.StickyNotes
            .Include(n => n.Project)
            .FirstOrDefaultAsync(
                n => n.Id == request.NoteId && n.Project != null && n.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        if (note is not null)
        {
            note.Color = request.Dto.Color;
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}