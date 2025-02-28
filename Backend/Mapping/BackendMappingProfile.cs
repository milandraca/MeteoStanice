using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;


namespace Backend.Mapping
{
    public class BackendMappingProfile:Profile
    {
        public BackendMappingProfile()
        {
            // kreiramo mapiranja: izvor, odredište
            CreateMap<Drzava, DrzavaDTORead>();
            CreateMap<DrzavaDTOInsertUpdate, Drzava>();
            CreateMap<Drzava, DrzavaDTOInsertUpdate>();




        }
    }
}

