using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Application.Features.BeatSheet.Queries;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.BeatSheet.Handlers;

public class GetBeatSheetQueryHandler(ApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetBeatSheetQuery, BeatSheetDto?>
{
    public async Task<BeatSheetDto?> Handle(GetBeatSheetQuery request, CancellationToken cancellationToken)
    {
        var beatSheet = await context.BeatSheets
            .AsNoTracking()
            .Include(b => b.Project) // Ensure Project is loaded to avoid null dereference
            .FirstOrDefaultAsync(
                b => b.ProjectId == request.ProjectId && b.Project != null && b.Project.ApplicationUserId == request.UserId,
                cancellationToken);

        return mapper.Map<BeatSheetDto>(beatSheet);
    }
}