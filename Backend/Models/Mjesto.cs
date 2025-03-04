using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Mjesto : Entitet
    {
        public string? Naziv { get; set; }
        public int BrojPoste { get; set; }
        [ForeignKey("regija_sifra")]
        public Regija? Regija { get; set; }
       
       
        
    }
    
}