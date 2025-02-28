using AutoMapper;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DrzavaController(BackendContext context, IMapper mapper) : BackendController(context, mapper)
    {


        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Drzave);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new {poruka= "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var drzava = _context.Drzave.Find(sifra);
                if (drzava == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }
                return Ok(drzava);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(Drzava drzava)
        {
            try
            {
                _context.Drzave.Add(drzava);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, drzava);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Drzava drzava)
        {
            try
            {

                var drzavaBaza = _context.Drzave.Find(sifra);
                if (drzavaBaza == null)
                {
                    return NotFound(new { poruka = $"Drzava s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                drzavaBaza.Naziv = drzava.Naziv;
               

                _context.Drzave.Update(drzavaBaza);
                _context.SaveChanges();
                return Ok(drzavaBaza);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var drzava = _context.Drzave.Find(sifra);
                if (drzava == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }
                _context.Drzave.Remove(drzava);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


    }
}
