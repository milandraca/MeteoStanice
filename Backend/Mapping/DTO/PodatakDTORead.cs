namespace Backend.Models.DTO
{
    public record PodatakDTORead(
        int Sifra,
        DateTime Vrijeme,
        decimal? Temperatura,
        decimal? BrzinaVjetra,
        decimal? RelativnaVlaga,
        decimal? KolicinaPadalina,
        string  MeteostanicaNaziv



     );


}
