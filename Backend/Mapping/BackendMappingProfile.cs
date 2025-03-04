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

            CreateMap<Regija, RegijaDTORead>().ForMember(
                "DrzavaNaziv",
                opt => opt.MapFrom(src => src.Drzava.Naziv)
                );
            CreateMap<RegijaDTOInsertUpdate, Regija>();
            CreateMap<Regija, RegijaDTOInsertUpdate>();

            CreateMap<Mjesto, MjestoDTORead>();
            CreateMap<MjestoDTOInsertUpdate, Mjesto>();
            CreateMap<Mjesto, MjestoDTOInsertUpdate>();

            CreateMap<Meteostanica, MeteostanicaDTORead>();
            CreateMap<MeteostanicaDTOInsertUpdate, Meteostanica>();
            CreateMap<Meteostanica, MeteostanicaDTOInsertUpdate>();

            CreateMap<Podatak, PodatakDTORead>();
            CreateMap<PodatakDTOInsertUpdate, Podatak>();
            CreateMap<Podatak, PodatakDTOInsertUpdate>();




        }
    }
}

