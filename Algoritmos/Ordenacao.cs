using ClinicaMedicaGrupo9.Dados;
using ClinicaMedicaGrupo9.Model;

namespace ClinicaMedicaGrupo9.Algoritmos;

public class Ordenacao
{
    private readonly RepositorioPacientes _repo;
    public Ordenacao(RepositorioPacientes repo)
    {
        _repo = repo;
    }
   
    /// <summary>
    /// Bubble Sort por nome (A-Z): compara vizinhos e leva o maior para o fim.
    /// </summary>
    public  List<Paciente> BubbleSortPorNome()
    {
        var lista = _repo.ObterTodos();


        for (int i = 0; i < lista.Count - 1; i++)
        {
            bool trocou = false;

            for (int j = 0; j < lista.Count - 1 - i; j++)
            {

                if (string.Compare(
                    lista[j].Nome,
                    lista[j + 1].Nome,
                    StringComparison.OrdinalIgnoreCase) > 0)
                {
                    (lista[j], lista[j + 1]) = (lista[j + 1], lista[j]);
                    trocou = true;
                }
            }

            if (!trocou)
                break;
        }

        return lista;
    }
    
    /// <summary>
    /// Quick Sort por idade (crescente): escolhe um pivô,
    /// separa menores e maiores.
    /// </summary>
    public List<Paciente> QuickSortPorIdade()
    {
        var lista = _repo.ObterTodos();

        QuickSort(lista, 0, lista.Count - 1);

        return lista;
    }

    private static void QuickSort(List<Paciente> lista, int baixo, int alto)
    {
        if (baixo >= alto)
            return;

        int pivo = Particionar(lista, baixo, alto);

        QuickSort(lista, baixo, pivo - 1);
        QuickSort(lista, pivo + 1, alto);
    }

    private static int Particionar(List<Paciente> lista, int baixo, int alto)
    {
        int valorPivo = lista[alto].Idade;
        int i = baixo - 1;

        for (int j = baixo; j < alto; j++)
        {
            if (lista[j].Idade <= valorPivo)
            {
                i++;
                (lista[i], lista[j]) = (lista[j], lista[i]);
            }
        }

        (lista[i + 1], lista[alto]) = (lista[alto], lista[i + 1]);

        return i + 1;
    }
}
