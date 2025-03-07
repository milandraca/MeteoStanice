using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Meteostanica : Entitet
    {
        public string Naziv { get; set; } = "";


        [Column(TypeName = "decimal(9,6)")]
        public decimal? Longitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal? Latitude { get; set; }

        [ForeignKey("mjesto_sifra")]
        public required Mjesto Mjesto { get; set; }

    }
}