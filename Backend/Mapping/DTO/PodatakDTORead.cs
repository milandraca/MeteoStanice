namespace Backend.Models.DTO
{
    public record PodatakDTORead(
        int id,
        DateTime Vrijeme,
        decimal Temperatura,
        decimal BrzinaVjetra,
        decimal RelativnaVlaga,
        decimal KolicinaPadalina,
        int MeteostanicaSifra



     );


}
