using ClinicaMedicaGrupo9.Model;

namespace ClinicaMedicaGrupo9.Dados;

public class RepositorioPacientes
{
    private readonly List<Paciente> _pacientes = new();
    private readonly object _trava = new();
    private int _proximoId;
    public RepositorioPacientes() => Restaurar();

    public void Restaurar()
    {
        lock (_trava)
        {
            _pacientes.Clear();
            _proximoId = 1;

            Inserir("Bruno Costa", "222.222.222-22", 52, Prioridade.Media);
            Inserir("Daniela Pires", "444.444.444-44", 29, Prioridade.Normal);
            Inserir("Fernanda Alves", "666.666.666-66", 61, Prioridade.Media);
            Inserir("Juliana Rocha", "101.010.101-01", 38, Prioridade.Media);
            Inserir("Helena Martins", "888.888.888-88", 79, Prioridade.Alta);
            Inserir("Eduardo Lima", "555.555.555-55", 45, Prioridade.Normal);
            Inserir("Igor Barbosa", "999.999.999-99", 23, Prioridade.Normal);
            Inserir("Gabriel Nogueira", "777.777.777-77", 8, Prioridade.Alta);
            Inserir("Carlos Souza", "333.333.333-33", 67, Prioridade.Alta);
            Inserir("Ana Paula Ribeiro", "111.111.111-11", 34, Prioridade.Normal);
        }
    }

    public Paciente Adicionar(NovoPaciente dados)
    {
        lock (_trava)
        {
            return Inserir(dados.Nome.Trim(), dados.Cpf, dados.Idade, dados.Prioridade);
        }
    }

    public bool ExisteCpf(string cpf)
    {
        lock (_trava)
        {
            return _pacientes.Any(p => p.Cpf == cpf);
        }
    }

    public List<Paciente> ObterTodos()
    {
        lock (_trava)
        {
            return _pacientes.ToList();
        }
    }

   public bool ExisteId(int id)
    {
        lock (_trava)
        {
            return _pacientes.Any(p => p.Id == id);
        }
    }

    public bool Remover(int id)
    {
        lock (_trava)
        {
            return _pacientes.RemoveAll(p => p.Id == id) > 0;
        }
    }
    private Paciente Inserir(string nome, string cpf, int idade, Prioridade prioridade)
    {
        var paciente = new Paciente
        {
            Id = _proximoId++,
            Nome = nome,
            Cpf = cpf,
            Idade = idade,
            Prioridade = prioridade
        };
        _pacientes.Add(paciente);
        return paciente;
    }
}
