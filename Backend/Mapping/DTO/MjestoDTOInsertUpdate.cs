
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record MjestoDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,


        [Required(ErrorMessage = "Broj poste obavezno")]
        int BrojPoste,
     
        [Required(ErrorMessage = "regija obavezno")]
        int RegijaSifra
        );
}