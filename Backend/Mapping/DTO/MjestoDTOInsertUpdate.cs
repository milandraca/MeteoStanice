
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record MjestoDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,


        
        int BrojPoste,
     
        [Required(ErrorMessage = "regija obavezno")]
        int RegijaSifra
        );
}