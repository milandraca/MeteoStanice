using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Backend.Controllers
{
    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom Operater
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OperaterController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly IMapper _mapper;

        public OperaterController(BackendContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Dohvaća sve operatere iz baze
        /// </summary>
        /// <returns>Operateri u bazi</returns>
        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpGet]
        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var operateri = _context.Operateri.ToList();

                if (operateri == null || operateri.Count == 0)
                {
                    return new EmptyResult();
                }

                List<OperaterDTORead> vrati = new();

                operateri.ForEach(o =>
                {
                    vrati.Add(_mapper.Map<OperaterDTORead>(o));
                });

                return Ok(vrati);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        /// <summary>
        /// Ažurira admin status operatera
        /// </summary>
        /// <param name="sifra">Šifra operatera</param>
        /// <param name="adminStatus">Novi admin status (true/false)</param>
        /// <returns>Potvrda o uspješnosti</returns>
        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="404">Operater nije pronađen</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpPut]
        [Route("{sifra}/admin")]
        public IActionResult UpdateAdminStatus(int sifra, [FromBody] JsonElement body)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var operater = _context.Operateri.Find(sifra);

                if (operater == null)
                {
                    return NotFound($"Operater s šifrom {sifra} nije pronađen");
                }

                bool adminStatus = false; // Initialize with a default value
                if (body.TryGetProperty("admin", out JsonElement adminElement))
                {
                    try
                    {
                        adminStatus = adminElement.GetBoolean();
                        operater.Admin = adminStatus;
                        _context.SaveChanges();
                        return Ok(new { poruka = $"Admin status operatera {operater.Email} uspješno ažuriran" });
                    }
                    catch
                    {
                        return BadRequest("Neispravan format admin statusa. Očekivano: true/false");
                    }
                }
                else
                {
                    return BadRequest("Neispravan format zahtjeva. Očekivano: { \"admin\": true/false }");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }
    }
}
