
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record RegijaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,
        
        [Required(ErrorMessage = "Drzava obavezno")]
        int DrzavaSifra
        
        );


}