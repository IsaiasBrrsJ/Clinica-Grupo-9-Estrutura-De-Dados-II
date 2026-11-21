
using ClinicaMedicaGrupo9.Algoritmos;
using ClinicaMedicaGrupo9.Dados;

namespace ClinicaMedicaGrupo9
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            builder.Services.AddSingleton<RepositorioPacientes>();
            builder.Services.AddTransient<Busca>();
            builder.Services.AddTransient<Ordenacao>();
            builder.Services.AddTransient<Selecao>();

            var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}");


            builder.Services.AddCors(o => o.AddPolicy("front",
            p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var repositorio = scope.ServiceProvider
                    .GetRequiredService<RepositorioPacientes>();

                repositorio.Restaurar();
            }


            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseCors("front");
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            

            app.Run();
        }
    }
}
