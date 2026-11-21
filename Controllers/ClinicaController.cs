using ClinicaMedicaGrupo9.Algoritmos;
using ClinicaMedicaGrupo9.Dados;
using ClinicaMedicaGrupo9.Model;
using Microsoft.AspNetCore.Mvc;

namespace ClinicaMedicaGrupo9.Controllers
{
    [Route("api/clinica")]
    [ApiController]

    public class ClinicaController : ControllerBase
    {
        private readonly RepositorioPacientes _repository;
        private readonly Busca _busca;
        private readonly Ordenacao _ordenacao;
        private readonly Selecao _selecao;

        public ClinicaController(
            RepositorioPacientes repository,
            Busca busca, 
            Ordenacao ordenacao,
            Selecao selecao)
        {
            _repository = repository;
            _busca = busca;
            _ordenacao = ordenacao;
            _selecao = selecao;
        }

        [HttpGet("buscar/{nome}")]
        public async Task<IActionResult> BuscaLinearPorNome([FromRoute] string nome)
        {
            var data = _busca.Linear(nome);

            return await Task.FromResult(Ok(data));
        }

        [HttpGet("buscar-binaria/{id}")]
        public async Task<IActionResult> BuscaBinariaPorId([FromRoute] int id)
        {
            var data = _busca.Binaria(id);

            return await Task.FromResult(Ok(data));
        }
        [HttpGet("buscar-ordenado-a-z-bubblesort")]
        public async Task<IActionResult> BuscarOrdenadoAZBubbleSort()
        {
            var data = _ordenacao.BubbleSortPorNome();

            return await Task.FromResult(Ok(data));
        }

        [HttpGet("buscar-ordenado-idade-quicksort")]
        public async Task<IActionResult> BuscarOrdenadoIdadeQuickSort()
        {
            var data = _ordenacao.QuickSortPorIdade();

            return await Task.FromResult(Ok(data));
        }


        [HttpGet("buscar-ordenado-idade-selecao")]
        public async Task<IActionResult> BuscarOrdenadoIdadeSelecao()
        {
           
            var data = _selecao.OrdenarPorIdade();
            return await Task.FromResult(Ok(data));
        }

        [HttpGet("buscar-top3-prioritarios-selecao")]
        public async Task<IActionResult> BuscarTop3PrioritariosSelecao()
        {
            var data = _selecao.Top3Prioritarios();
            return await Task.FromResult(Ok(data));
        }

        [HttpGet("buscar-todos")]
        public async Task<IEnumerable<Paciente>> BuscarTodosPacientes()
        {

            var data = _repository.ObterTodos();

            return await Task.FromResult(data);
        }
        [HttpPost("incluir-paciente")]
        public async Task<IActionResult> IncluirPaciente([FromBody] NovoPaciente dados)
        {
            if (_repository.ExisteCpf(dados.Cpf))
            {
                return await Task.FromResult(BadRequest("CPF já cadastrado."));
            }
            var paciente = _repository.Adicionar(dados);

            return await Task.FromResult(Ok(paciente));
        }
        [HttpDelete("remover-paciente/{id}")]
        public async Task<IActionResult> RemoverPaciente([FromRoute] int id)
        {
            if (!_repository.ExisteId(id))
                return await Task.FromResult(BadRequest("Paciente não encontrado."));
            
            _repository.Remover(id);
            return await Task.FromResult(Ok("Paciente removido com sucesso."));
        }
    }
}
