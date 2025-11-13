using AutoMapper;
using SaveTheCat.Application.Dtos;
using SaveTheCat.Domain.Entities;

namespace SaveTheCat.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // De Entidad -> A DTO
        CreateMap<Project, ProjectDto>();
        CreateMap<BeatSheet, BeatSheetDto>();
        CreateMap<StickyNote, StickyNoteDto>();

        // Mapeo genérico para Character y Location a EntityDto
        CreateMap<Character, EntityDto>();
        CreateMap<Location, EntityDto>();
    }
}