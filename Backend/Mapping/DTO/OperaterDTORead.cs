namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za čitanje operatera.
    /// </summary>
    /// <param name="Sifra">Šifra operatera</param>
    /// <param name="Email">Email operatera</param>
    /// <param name="Admin">Označava je li operater administrator</param>
    public record OperaterDTORead(
        int Sifra,
        string Email,
        bool Admin);
}
