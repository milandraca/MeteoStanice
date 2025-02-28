
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record RegijaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        [Required(ErrorMessage = "regija obavezno")]
        int? DrzavaSifra
        
        );


}