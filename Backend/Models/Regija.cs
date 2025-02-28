using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Regija : Entitet
    {
        public string Naziv { get; set; }

        [ForeignKey("drzava_sifra")]
        public required Drzava Drzava { get; set; }

        

       
    }
}