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
    public class MjestoController(BackendContext context, IMapper mapper) : BackendController(context, mapper)
    {


        // RUTE
        [HttpGet]
        public ActionResult<List<MjestoDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<MjestoDTORead>>(_context.Mjesta.Include(g => g.Regija)));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<MjestoDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Mjesto? e;
            try
            {
                e = _context.Mjesta.Include(g => g.Regija).FirstOrDefault(g => g.Sifra == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Mjesto ne postoji u bazi" });
            }

            return Ok(_mapper.Map<MjestoDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(MjestoDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Regija es;
            try
            {
                es = _context.Regije.Find(dto.RegijaSifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (es == null)
            {
                return NotFound(new { poruka = "Mjesto u regiji ne postoji u bazi" });
            }

            try
            {
                var e = _mapper.Map<Mjesto>(dto);
                e.Regija = es;
                _context.Mjesta.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<MjestoDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }



        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, MjestoDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Mjesto? e;
                try
                {
                    e = _context.Mjesta.Include(g => g.Regija).FirstOrDefault(x => x.Sifra == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Mjesto ne postoji u bazi" });
                }

                Regija? es;
                try
                {
                    es = _context.Regije.Find(dto.RegijaSifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (es == null)
                {
                    return NotFound(new { poruka = "Mjesto U regiji ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);
                e.Regija = es;
                _context.Mjesta.Update(e);
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
                Mjesto? e;
                try
                {
                    e = _context.Mjesta.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Mjesto ne postoji u bazi");
                }
                _context.Mjesta.Remove(e);
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