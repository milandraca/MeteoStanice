using Backend.Data;
using Backend.Mapping;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// dodati swagger
builder.Services.AddSwaggerGen();


// dodavanje db contexta
builder.Services.AddDbContext<BackendContext>(o => {
    o.UseSqlServer(builder.Configuration.GetConnectionString("BazaContext"));
});


// Svi se od svuda na sve moguce nacine mogu spojitina naš API
// Èitati https://code-maze.com/aspnetcore-webapi-best-practices/
builder.Services.AddCors(o => {
    o.AddPolicy("CorsPolicy", b => {
        b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
builder.Services.AddAutoMapper(typeof(BackendMappingProfile));

// SECURITY
builder.Services.AddEdunovaSecurity();
builder.Services.AddAuthorization();
// END SECURITY


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