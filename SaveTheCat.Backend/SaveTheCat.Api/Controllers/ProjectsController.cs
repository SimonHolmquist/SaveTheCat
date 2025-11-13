using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaveTheCat.Application.Dtos; // <-- Namespace Corregido
using SaveTheCat.Application.Features.Projects.Commands;
using SaveTheCat.Application.Features.Projects.Queries;

namespace SaveTheCat.Api.Controllers;

[Authorize]
public class ProjectsController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var query = new GetProjectsQuery(CurrentUserId!);
        var projects = await _mediator.Send(query);
        return Ok(projects);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto createDto)
    {
        var command = new CreateProjectCommand(createDto.Name, CurrentUserId!);
        var projectDto = await _mediator.Send(command);

        // Devuelve una respuesta 201 Created con la ubicación y el objeto creado
        return CreatedAtAction(nameof(GetProjects), new { id = projectDto.Id }, projectDto);
    }

    [HttpPut("{projectId}")]
    public async Task<IActionResult> UpdateProject(Guid projectId, UpdateProjectDto updateDto)
    {
        var command = new UpdateProjectCommand(projectId, updateDto.Name, CurrentUserId!);
        await _mediator.Send(command);
        return NoContent(); // 204 No Content es estándar para un PUT exitoso
    }

    [HttpDelete("{projectId}")]
    public async Task<IActionResult> DeleteProject(Guid projectId)
    {
        var command = new DeleteProjectCommand(projectId, CurrentUserId!);
        await _mediator.Send(command);
        return NoContent(); // 204 No Content es estándar para un DELETE exitoso
    }
}