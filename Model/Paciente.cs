namespace ClinicaMedicaGrupo9.Model;

public enum Prioridade
{
    Normal = 1,
    Media = 2,
    Alta = 3
}
public class Paciente
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public int Idade { get; set; }
    public Prioridade Prioridade { get; set; } = Prioridade.Normal;
}

public record NovoPaciente(string Nome, string Cpf, int Idade, Prioridade Prioridade);
