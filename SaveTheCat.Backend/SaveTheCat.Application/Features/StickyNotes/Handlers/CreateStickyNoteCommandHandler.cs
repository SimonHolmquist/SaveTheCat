using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.StickyNotes.Commands;
using SaveTheCat.Domain.Entities;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.StickyNotes.Handlers;

public class CreateStickyNoteCommandHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateStickyNoteCommand, StickyNoteDto?>
{
    public async Task<StickyNoteDto?> Handle(CreateStickyNoteCommand request, CancellationToken cancellationToken)
    {
        var isOwner = await context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.ApplicationUserId == request.UserId, cancellationToken);
        if (!isOwner) return null;

        var dto = request.Dto;
        var note = new StickyNote
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            X = dto.X,
            Y = dto.Y,
            SceneHeading = dto.SceneHeading,
            Description = dto.Description,
            EmotionalCharge = dto.EmotionalCharge,
            EmotionalDescription = dto.EmotionalDescription,
            Conflict = dto.Conflict,
            Color = dto.Color,
            BeatItem = dto.BeatItem ?? string.Empty
        };

        context.StickyNotes.Add(note);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<StickyNoteDto>(note);
    }
}