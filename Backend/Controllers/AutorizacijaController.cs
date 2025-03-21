﻿﻿﻿﻿﻿using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Backend.Controllers
{
    /// <summary>
    /// Kontroler za autorizaciju korisnika.
    /// </summary>
    /// <remarks>
    /// Inicijalizira novu instancu klase <see cref="AutorizacijaController"/>.
    /// </remarks>
    /// <param name="context">Kontekst baze podataka.</param>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutorizacijaController(BackendContext context) : ControllerBase
    {
        /// <summary>
        /// Kontekst baze podataka
        /// </summary>
        private readonly BackendContext _context = context;

        /// <summary>
        /// Registrira novog operatera.
        /// </summary>
        /// <param name="operater">DTO objekt koji sadrži email i lozinku operatera.</param>
        /// <returns>Status 201 Created ako je registracija uspješna, inače vraća odgovarajući status greške.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        /// <code lang="json">
        /// {
        ///   "email": "novi@korisnik.hr",
        ///   "password": "lozinka123"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("register")]
        public IActionResult Registracija(OperaterDTO operater)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Provjeri postoji li već operater s istim emailom
            var postojeciOperater = _context.Operateri
                .Where(p => p.Email!.Equals(operater.Email))
                .FirstOrDefault();

            if (postojeciOperater != null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Operater s tim emailom već postoji");
            }

            // Kreiraj novog operatera
            var noviOperater = new Operater
            {
                Email = operater.Email,
                // Hashiraj lozinku prije spremanja
                Lozinka = BCrypt.Net.BCrypt.HashPassword(operater.Password)
            };

            _context.Operateri.Add(noviOperater);
            _context.SaveChanges();

            return StatusCode(StatusCodes.Status201Created, "Operater uspješno registriran");
        }

        /// <summary>
        /// Generira token za autorizaciju.
        /// </summary>
        /// <param name="operater">DTO objekt koji sadrži email i lozinku operatera.</param>
        /// <returns>JWT token ako je autorizacija uspješna, inače vraća status 403.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        /// <code lang="json">
        /// {
        ///   "email": "edunova@edunova.hr",
        ///   "password": "edunova"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("token")]
        public IActionResult GenerirajToken(OperaterDTO operater)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var operBaza = _context.Operateri
                   .Where(p => p.Email!.Equals(operater.Email))
                   .FirstOrDefault();

            if (operBaza == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, ne mogu naći operatera");
            }

            if (!BCrypt.Net.BCrypt.Verify(operater.Password, operBaza.Lozinka))
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, lozinka ne odgovara");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(jwt);
        }
    }
}
