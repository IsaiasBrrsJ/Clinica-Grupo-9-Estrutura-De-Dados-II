using ClinicaMedicaGrupo9.Dados;
using ClinicaMedicaGrupo9.Model;

namespace ClinicaMedicaGrupo9.Algoritmos;

public class Selecao
{
    private readonly RepositorioPacientes _repo;
    public Selecao(RepositorioPacientes repo)
    {
        _repo = repo;
    }

    /// <summary>
    /// Selection Sort por idade (decrescente): a cada passada seleciona o menor
    /// </summary>
    public List<Paciente> OrdenarPorIdade()
    {
        var lista = _repo.ObterTodos();

        for (int i = 0; i < lista.Count - 1; i++)
        {
            int menor = i;
            for (int j = i + 1; j < lista.Count; j++)
            {
              
                if (lista[j].Idade > lista[menor].Idade)
                    menor = j;
            }

            if (menor != i)
             (lista[i], lista[menor]) = (lista[menor], lista[i]);
            
        }

        return lista;
    }


    /// <summary>
    /// Selection Sort para encontrar os 3 pacientes mais prioritários.
    /// Prioridade maior primeiro; em caso de empate, maior idade primeiro.
    /// </summary>
    public List<Paciente> Top3Prioritarios()
    {
        var lista = _repo.ObterTodos();

        int limite = Math.Min(3, lista.Count);

        for (int i = 0; i < limite; i++)
        {
            int melhor = i;

            for (int j = i + 1; j < lista.Count; j++)
            {
                if (MaisPrioritario(lista[j], lista[melhor]))
                {
                    melhor = j;
                }
            }

            if (melhor != i)
            {
                (lista[i], lista[melhor]) = (lista[melhor], lista[i]);
            }
        }

        return lista.Take(limite).ToList();
    }

    private static bool MaisPrioritario(Paciente a, Paciente b)
    {
        if (a.Prioridade != b.Prioridade)
            return (int)a.Prioridade > (int)b.Prioridade;

        return a.Idade > b.Idade;
    }

}
