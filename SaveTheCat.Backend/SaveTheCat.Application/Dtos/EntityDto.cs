namespace SaveTheCat.Application.Dtos;

// DTO genérico para Devolver (CharacterDto, LocationDto)
public record EntityDto(
    Guid Id,
    string Name,
    Guid ProjectId
);
