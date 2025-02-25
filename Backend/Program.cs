using Backend.Data;
using Microsoft.EntityFrameworkCore;

    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

    // dodati swagger
    builder.Services.AddSwaggerGen();


    // dodavanje db contexta
    builder.Services.AddDbContext<BackendContext>(o =>
        {
            o.UseSqlServer(builder.Configuration.GetConnectionString("BazaContext"));
        });
    builder.Services.AddCors(o =>     {
o.AddPolicy("CorsPolicy", b => {
b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
});
    });
    // dodavanje servisa
    builder.Services.AddScoped<IPersonService, PersonService>();
    builder.Services.AddScoped<IPersonRepository, PersonRepository>();
    var connectionString = builder.Configuration.GetConnectionString("BazaContext");
    using (var db = new BackendContext(connectionString))
    {
        if (db.Database.EnsureCreated())
        {
            db.Persons.Add(new Person { Name = "Pero", Surname = "Perić", Age = 20 });
            db.Persons.Add(new Person { Name = "Ivo", Surname = "Ivić", Age = 30 });
            db.Persons.Add(new Person { Name = "Ana", Surname = "Anić", Age = 40 });
            db.Persons.Add(new Person { Name = "Maja", Surname = "Majić", Age = 50 });
            db.SaveChanges();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.MapOpenApi();



            app.UseHttpsRedirection();

            app.UseAuthorization();

            // swagger sucelje
            app.UseSwagger();
            app.UseSwaggerUI(o =>
            {
                o.EnableTryItOutByDefault();
                o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
            });

            app.MapControllers();

            app.UseStaticFiles();
            app.UseDefaultFiles();
            app.MapFallbackToFile("index.html");

            app.UseCors("CorsPolicy");


            app.Run();

        }
    }