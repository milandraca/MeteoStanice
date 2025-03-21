namespace Backend.Models
{
    /// <summary>
    /// Operater koji se koristi za prijavu u sustav.
    /// </summary>
    public class Operater : Entitet
    {
        /// <summary>
        /// Email operatera.
        /// </summary>
        public string Email { get; set; } = "";
        /// <summary>
        /// Lozinka operatera.
        /// </summary>
        public string Lozinka { get; set; } = "";
        /// <summary>
        /// Označava je li operater administrator.
        /// </summary>
        public bool Admin { get; set; } = false;
    }
}
