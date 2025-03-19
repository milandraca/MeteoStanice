﻿using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> opcije) : base(opcije)
        {

        }


        public DbSet<Drzava> Drzave { get; set; }

        public DbSet<Mjesto> Mjesta { get; set; }

        public DbSet<Meteostanica> Meteostanice { get; set; }

        public DbSet<Podatak> Podaci { get; set; }

        public DbSet<Regija> Regije { get; set; }

        public DbSet<Operater> Operateri { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // implementacija veze 1:n
            modelBuilder.Entity<Regija>().HasOne(g => g.Drzava);

            modelBuilder.Entity<Mjesto>().HasOne(g => g.Regija);

            modelBuilder.Entity<Meteostanica>().HasOne(g => g.Mjesto);

            modelBuilder.Entity<Podatak>().HasOne(g => g.Meteostanica);


        }


    }
}
