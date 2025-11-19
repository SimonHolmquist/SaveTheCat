using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.StickyNotes.Commands;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.StickyNotes.Handlers;

// El Handler:
public class UpdateStickyNoteCommandHandler(ApplicationDbContext context, AutoMapper.IMapper mapper)
    : IRequestHandler<UpdateStickyNoteCommand, StickyNoteDto?>
{
    public async Task<StickyNoteDto?> Handle(UpdateStickyNoteCommand request, CancellationToken cancellationToken)
    {
        // Busca la nota y valida que le pertenece al usuario en una sola consulta
        var note = await context.StickyNotes
            .Include(n => n.Project) // Ensure Project is loaded to avoid null dereference
            .FirstOrDefaultAsync(n => n.Id == request.NoteId && n.Project != null && n.Project.ApplicationUserId == request.UserId, cancellationToken);

        if (note is null)
        {
            return null; // O lanzar una excepción
        }

        // Mapea los campos del DTO a la entidad
        var dto = request.Dto;
        note.SceneHeading = dto.SceneHeading;
        note.Description = dto.Description;
        note.EmotionalCharge = dto.EmotionalCharge;
        note.EmotionalDescription = dto.EmotionalDescription;
        note.Conflict = dto.Conflict;
        note.Color = dto.Color;
        note.BeatItem = dto.BeatItem ?? string.Empty;
        note.X = dto.X; // También actualiza X/Y
        note.Y = dto.Y;

        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<StickyNoteDto>(note);
    }
}