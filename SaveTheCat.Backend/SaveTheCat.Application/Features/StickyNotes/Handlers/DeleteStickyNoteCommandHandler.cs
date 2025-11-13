using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Features.StickyNotes.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.StickyNotes.Handlers;

// El Handler:
public class DeleteStickyNoteCommandHandler(ApplicationDbContext context)
    : IRequestHandler<DeleteStickyNoteCommand>
{
    public async Task Handle(DeleteStickyNoteCommand request, CancellationToken cancellationToken)
    {
        var note = await context.StickyNotes
            .Include(n => n.Project)
            .FirstOrDefaultAsync(
                n => n.Id == request.NoteId && n.Project != null && n.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        if (note is not null)
        {
            context.StickyNotes.Remove(note);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}