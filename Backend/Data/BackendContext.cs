using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {

        public BackendContext(DbContextOptions<BackendContext> opcije) : base(opcije)
        {
            //ovdje se  mogu fino postaviti opcije, ali ne za sada
        }


        public DbSet<Drzava> Drzave { get; set; }
    }
}
