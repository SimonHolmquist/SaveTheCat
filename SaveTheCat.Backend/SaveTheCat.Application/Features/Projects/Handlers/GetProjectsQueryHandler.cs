using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SaveTheCat.Application.Dtos; // <-- Namespace corregido
using SaveTheCat.Application.Features.Projects.Queries;
using SaveTheCat.Infrastructure.Data;

namespace SaveTheCat.Application.Features.Projects.Handlers;

public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, IEnumerable<ProjectDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProjectsQueryHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var projects = await _context.Projects
            .AsNoTracking() // Mejora el rendimiento para consultas de solo lectura
            .Where(p => p.ApplicationUserId == request.UserId) // Filtra por el usuario
            .OrderBy(p => p.Name)
            .ProjectTo<ProjectDto>(_mapper.ConfigurationProvider) // AutoMapper mapea la consulta de BD
            .ToListAsync(cancellationToken);

        return projects;
    }
}