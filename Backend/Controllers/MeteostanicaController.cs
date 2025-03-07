using AutoMapper;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Backend.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class MeteostanicaController(BackendContext context, IMapper mapper) : BackendController(context, mapper)
    {


        // RUTE
        [HttpGet]
        public ActionResult<List<MeteostanicaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<MeteostanicaDTORead>>(
                    _context.Meteostanice
                    .Include(m => m.Mjesto).ThenInclude(r => r.Regija).ThenInclude(d => d.Drzava)));

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<MeteostanicaDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Meteostanica? e;
            try
            {
                e = _context.Meteostanice.Include(g => g.Mjesto).FirstOrDefault(g => g.Sifra == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Meteostanica ne postoji u bazi" });
            }

            return Ok(_mapper.Map<MeteostanicaDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(MeteostanicaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Mjesto? es;
            try
            {
                es = _context.Mjesta.Find(dto.MjestoSifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (es == null)
            {
                return NotFound(new { poruka = "Meteostanica u mjestu ne postoji u bazi" });
            }

            try
            {
                var e = _mapper.Map<Meteostanica>(dto);
                e.Mjesto = es;
                _context.Meteostanice.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<MeteostanicaDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }



        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, MeteostanicaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Meteostanica? e;
                try
                {
                    e = _context.Meteostanice.Include(g => g.Mjesto).FirstOrDefault(x => x.Sifra == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Meteostanica ne postoji u bazi" });
                }

                Mjesto? es;
                try
                {
                    es = _context.Mjesta.Find(dto.MjestoSifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (es == null)
                {
                    return NotFound(new { poruka = "Meteostanica u mjestu ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);
                e.Mjesto = es;
                _context.Meteostanice.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }

        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Meteostanica? e;
                try
                {
                    e = _context.Meteostanice.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Meteostanica ne postoji u bazi");
                }
                _context.Meteostanice.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


    }
}