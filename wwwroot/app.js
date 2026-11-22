const API = window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/api"
    : "http://0.0.0.0:10000/api";

const PRIORIDADE_TEXTO = {
    1: "Normal",
    2: "Media",
    3: "Alta"
};

const prioridadeTexto = v => PRIORIDADE_TEXTO[v] ?? "Normal";

function render(lista) {
    const tbody = document.getElementById("tabela");
    tbody.innerHTML = "";

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Nenhum paciente encontrado.
                </td>
            </tr>`;

        document.getElementById("totalPacientes").textContent = "0 pacientes";
        return;
    }

    lista.forEach(p => {
        const prio = prioridadeTexto(p.prioridade);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td style="color:#8a8a82">#${p.id}</td>
            <td><strong>${p.nome}</strong></td>
            <td>${p.cpf}</td>
            <td>${p.idade}</td>
            <td><span class="pill ${prio}">${prio}</span></td>
            <td>
                <button class="btn btn-danger"
                    onclick="RemoverPaciente(${p.id})">
                    Remover
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById("totalPacientes").textContent =
        `${lista.length} paciente${lista.length === 1 ? "" : "s"}`;
}


async function carregarTodos() {
    try {
        const r = await fetch(`${API}/clinica/buscar-todos`);

        if (!r.ok)
            throw new Error("Erro ao carregar pacientes.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Lista carregada.";

    } catch (err) {
        console.error("Erro ao buscar pacientes:", err);

        document.getElementById("status").textContent =
            "Erro ao conectar com a API.";
    }
}


async function BuscarLinearPorNome() {
    try {
        const nome = document.getElementById("buscaNome").value.trim();

        if (!nome) {
            alert("Digite um nome para buscar.");
            return;
        }

        const r = await fetch(
            `${API}/clinica/buscar/${encodeURIComponent(nome)}`
        );

        if (!r.ok)
            throw new Error("Erro na busca linear.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Busca linear realizada.";

    } catch (err) {
        console.error("Erro ao buscar paciente:", err);
        document.getElementById("status").textContent =
            "Erro ao conectar com a API.";
    }
}


async function BuscarBinariaPorId() {
    try {
        const id = document.getElementById("buscaId").value;

        if (!id || Number(id) <= 0) {
            alert("Informe um ID válido.");
            return;
        }

        const r = await fetch(
            `${API}/clinica/buscar-binaria/${id}`
        );

        if (!r.ok)
            throw new Error("Paciente não encontrado.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Busca binária realizada.";

    } catch (err) {
        console.error("Erro ao buscar paciente:", err);
        document.getElementById("status").textContent =
            "Erro ao realizar busca binária.";
    }
}


async function BuscarOrdenadoAZBubbleSort() {
    try {
        const r = await fetch(
            `${API}/clinica/buscar-ordenado-a-z-bubblesort`
        );

        if (!r.ok)
            throw new Error("Erro no Bubble Sort.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Ordenação A-Z realizada com Bubble Sort.";

    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent =
            "Erro ao executar Bubble Sort.";
    }
}


async function BuscarOrdenadoIdadeQuickSort() {
    try {
        const r = await fetch(
            `${API}/clinica/buscar-ordenado-idade-quicksort`
        );

        if (!r.ok)
            throw new Error("Erro no Quick Sort.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Ordenação por idade realizada com Quick Sort.";

    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent =
            "Erro ao executar Quick Sort.";
    }
}

async function BuscarOrdenadoIdadeSelecao() {
    try {
        const r = await fetch(
            `${API}/clinica/buscar-ordenado-idade-selecao`
        );

        if (!r.ok)
            throw new Error("Erro no Selection Sort.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Ordenação por idade realizada com Selection Sort.";

    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent =
            "Erro ao executar Selection Sort.";
    }
}


async function BuscarTop3PrioritariosSelecao() {
    try {
        const r = await fetch(
            `${API}/clinica/buscar-top3-prioritarios-selecao`
        );

        if (!r.ok)
            throw new Error("Erro ao buscar Top 3.");

        const data = await r.json();

        render(data);

        document.getElementById("status").textContent =
            "Top 3 pacientes prioritários.";

    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent =
            "Erro ao buscar Top 3.";
    }
}


async function RestaurarLista() {
    try {
        const r = await fetch(
            `${API}/clinica/restaurar-lista`,
            {
                method: "POST"
            }
        );

        if (!r.ok) {
            throw new Error("Erro ao restaurar lista");
        }

        await carregarTodos();

        document.getElementById("status").textContent =
            "Lista restaurada com sucesso!";

    } catch (err) {
        console.error(err);

        document.getElementById("status").textContent =
            "Erro ao restaurar lista.";
    }
}

async function IncluirPaciente() {
    try {
        const paciente = {
            nome: document.getElementById("nome").value.trim(),
            cpf: document.getElementById("cpf").value.trim(),
            idade: parseInt(document.getElementById("idade").value),
            prioridade: parseInt(document.getElementById("prioridade").value)
        };

        if (!paciente.nome || !paciente.cpf ||
            isNaN(paciente.idade) || paciente.idade < 0 ||
            paciente.idade > 120) {
            alert("Preencha os dados corretamente.");
            return;
        }

        const response = await fetch(
            `${API}/clinica/incluir-paciente`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paciente)
            }
        );

        if (!response.ok) {
            alert(await response.text());
            return;
        }

        alert("Paciente cadastrado com sucesso!");

        document.getElementById("form").reset();

        await carregarTodos();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar paciente.");
    }
}


async function RemoverPaciente(id) {
    if (!confirm("Deseja realmente remover este paciente?"))
        return;

    try {
        const response = await fetch(
            `${API}/clinica/remover-paciente/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await response.text();


        await carregarTodos();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao remover paciente.");
    }
}


document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    IncluirPaciente();
});


carregarTodos();
