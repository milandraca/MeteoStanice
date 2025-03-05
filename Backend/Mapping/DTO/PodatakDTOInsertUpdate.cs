
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record PodatakDTOInsertUpdate(
        [Required(ErrorMessage = "Vrijeme obavezno")]
        DateTime Vrijeme,
        [Required(ErrorMessage = "ID obavezno")]
        
        decimal Temperatura,
        int BrzinaVjetra,
        decimal RelativnaVlaga,
        decimal KolicinaPadalina,
        int MeteostanicaSifra




        );


}