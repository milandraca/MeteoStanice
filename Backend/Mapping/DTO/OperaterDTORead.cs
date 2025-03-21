namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za čitanje operatera.
    /// </summary>
    /// <param name="Sifra">Šifra operatera</param>
    /// <param name="Email">Email operatera</param>
    public record OperaterDTORead(
        int Sifra,
        string Email);
}
