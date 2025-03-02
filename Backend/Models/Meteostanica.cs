using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Meteostanica : Mjesto
    {
        public string Naziv { get; set; }

        [ForeignKey("mjesto_sifra")]

        public decimal Longitude { get; set; }

        public decimal Latitude { get; set; }


        public required Mjesto Mjesto { get; set; }




    }
}