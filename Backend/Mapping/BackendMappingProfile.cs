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

            CreateMap<Mjesto, MjestoDTORead>().ForMember(
                "RegijaNaziv",
                opt => opt.MapFrom(src => src.Regija.Naziv)
                );
            CreateMap<MjestoDTOInsertUpdate, Mjesto>();
            CreateMap<Mjesto, MjestoDTOInsertUpdate>();

            CreateMap<Meteostanica, MeteostanicaDTORead>().ForMember(
                "MjestoNaziv",opt => opt.MapFrom(src => src.Mjesto.Naziv))
                
                .ForMember("RegijaNaziv", opt => opt.MapFrom(src => src.Mjesto.Regija.Naziv))
                .ForMember("DrzavaNaziv", opt => opt.MapFrom(src => src.Mjesto.Regija.Drzava.Naziv)
                );
            CreateMap<MeteostanicaDTOInsertUpdate, Meteostanica>();
            CreateMap<Meteostanica, MeteostanicaDTOInsertUpdate>();

            CreateMap<Podatak, PodatakDTORead>()
                .ForMember("MeteostanicaNaziv", opt => opt.MapFrom(src => src.Meteostanica.Naziv)
                



                );

            CreateMap<PodatakDTOInsertUpdate, Podatak>();
            CreateMap<Podatak, PodatakDTOInsertUpdate>();




        }
    }
}

