namespace Backend.Models.DTO
{
    public record MeteostanicaDTORead(
        int Sifra,
        string Naziv,
        decimal Longitude,
        decimal Latitude,
        string MjestoNaziv,
        string RegijaNaziv,
        string DrzavaNaziv

     );


}
