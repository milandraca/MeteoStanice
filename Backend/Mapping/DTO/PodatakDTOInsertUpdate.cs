
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record PodatakDTOInsertUpdate(
        [Required(ErrorMessage = "Vrijeme obavezno")]
        DateTime Vrijeme,
        [Required(ErrorMessage = "ID obavezno")]
        int id,
        decimal Temperatura,
        decimal BrzinaVjetra,
        decimal RelativnaVlaga,
        decimal KolicinaPadalina,
        int MeteostanicaSifra




        );


}