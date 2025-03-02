using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record MeteostanicaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,
        decimal Longitude,
        decimal Latitude,

        [Required(ErrorMessage = "Mjesto obavezno")]
        int MjestoSifra

        );


}