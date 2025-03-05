using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Podatak : Entitet
    {
        public int Id { get; set; }
        [ForeignKey("meteostanica_sifra")]
        public DateTime Vrijeme { get; set; }
        public int? BrzinaVjetra { get; set; }
        public decimal? Temperatura { get; set; }
        public decimal? RelativnaVlaga { get; set; }
        public decimal? KolicinaPadalina { get; set; }

        public Meteostanica Meteostanica { get; set; }  // Navigacijska svojnost
    }






}
