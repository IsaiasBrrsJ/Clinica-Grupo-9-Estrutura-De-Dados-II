using ClinicaMedicaGrupo9.Dados;
using ClinicaMedicaGrupo9.Model;

namespace ClinicaMedicaGrupo9.Algoritmos;

public class Busca
{
    private readonly RepositorioPacientes _repo;
    public Busca(RepositorioPacientes repo)
    {
        _repo = repo;
    }

    /// <summary>
    /// Busca linear por nome: percorre todos os elementos, um a um.
    /// </summary>
    public List<Paciente> Linear(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            return new List<Paciente>();
        }

        var termo = nome.Trim();
        var data = _repo.ObterTodos();
        var encontrados = new List<Paciente>();
        foreach (var pacientes in data)
        {
            if (pacientes.Nome.Contains(termo, StringComparison.OrdinalIgnoreCase))
                encontrados.Add(pacientes);
          
        }
        
        return encontrados;
    }
    /// <summary>
    /// Busca binária por ID: divide a lista ordenada ao meio a cada passo.
    /// </summary>
    public  List<Paciente> Binaria( int id)
    {

        var ordenados = _repo.ObterTodos();
      
        var encontrados = new List<Paciente>();
       
        int inicio = 0;
        int fim = ordenados.Count - 1;

        while (inicio <= fim)
        {
            int meio = inicio + (fim - inicio) / 2;
            int idMeio = ordenados[meio].Id;

            if (idMeio == id)
            {
                encontrados.Add(ordenados[meio]);
                break;
            }

            if (idMeio < id)
                inicio = meio + 1;
            else
                fim = meio - 1;
        }

        return encontrados;
    }

}
