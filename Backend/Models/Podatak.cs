﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Podatak : Entitet
    {
        [ForeignKey("meteostanica_sifra")]

        public required Meteostanica Meteostanica { get; set; }



        public DateTime? Vrijeme { get; set; }

        public decimal Temperatura { get; set; }
        public decimal BrzinaVjetra { get; set; }
        public decimal RelativnaVlaga { get; set; }
        public decimal KolicinaPadalina { get; set; }







    }
}