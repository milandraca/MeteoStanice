using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Meteostanica : Entitet
    {
        public string Naziv { get; set; }

        

        public decimal Longitude { get; set; }

        public decimal Latitude { get; set; }

        [ForeignKey("mjesto_sifra")]
        public required Mjesto Mjesto { get; set; }




    }
}