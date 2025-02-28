using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record DrzavaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv
        
        );
}