using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Drzava : Entitet
    {
        public int Sifra { get; set; }
        public string Naziv { get; set; } 

    }
}

