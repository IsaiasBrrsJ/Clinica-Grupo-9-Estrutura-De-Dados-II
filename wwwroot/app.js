const API = window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
    ? "http://localhost:5103/api"
    : "https://clinica-grupo-9-estrutura-de-dados-ii.onrender.com/api";

const PRIORIDADE_TEXTO = {
    1: "Normal",
    2: "Media",
    3: "Alta"
};

const prioridadeTexto = v => PRIORIDADE_TEXTO[v] ?? "Normal";


function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")           
        .slice(0, 11)                  
        .replace(/(\d{3})(\d)/, "$1.$2")        
        .replace(/(\d{3})(\d)/, "$1.$2")       
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function aplicarMascaraCPF(input) {
    input.addEventListener("input", function () {
        const posicaoFinal = this.selectionStart === this.value.length;
        this.value = mascaraCPF(this.value);
        if (posicaoFinal) {
            this.setSelectionRange(this.value.length, this.value.length);
        }
    });

    input.addEventListener("keydown", function (e) {
        // permite navegação e atalhos
        const permitidas = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
        if (permitidas.includes(e.key) || e.ctrlKey || e.metaKey) return;
        // bloqueia qualquer tecla que não seja número
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    });
}

/* ---------- loading helpers ---------- */
function setLoading(btn, isLoading) {
    if (!btn) return;
    const spinner = btn.querySelector(".btn-spinner");
    if (!spinner) return;
    if (isLoading) {
        btn.classList.add("loading");
        btn.disabled = true;
        btn.dataset.originalText = btn.querySelector(".btn-text")?.textContent || "";
        if (btn.querySelector(".btn-text")) {
            btn.querySelector(".btn-text").textContent = "Carregando...";
        }
    } else {
        btn.classList.remove("loading");
        btn.disabled = false;
        if (btn.querySelector(".btn-text")) {
            btn.querySelector(".btn-text").textContent = btn.dataset.originalText || "OK";
        }
    }
}


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
                    onclick="RemoverPaciente(${p.id}, this)">
                    <span class="btn-spinner"></span><span class="btn-text">Remover</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("totalPacientes").textContent =
        `${lista.length} paciente${lista.length === 1 ? "" : "s"}`;
}


async function carregarTodos(btn) {
    setLoading(btn || document.getElementById("btnTodos"), true);
    try {
        const r = await fetch(`${API}/clinica/buscar-todos`);
        if (!r.ok) throw new Error("Erro ao carregar pacientes.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Lista carregada.";
    } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
        document.getElementById("status").textContent = "Erro ao conectar com a API.";
    } finally {
        setLoading(btn || document.getElementById("btnTodos"), false);
    }
}

async function BuscarLinearPorNome() {
    const btn = document.getElementById("btnBuscaLinear");
    try {
        const nome = document.getElementById("buscaNome").value.trim();
        if (!nome) {
            alert("Digite um nome para buscar.");
            return;
        }
        setLoading(btn, true);
        const r = await fetch(`${API}/clinica/buscar/${encodeURIComponent(nome)}`);
        if (!r.ok) throw new Error("Erro na busca linear.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Busca linear realizada.";
    } catch (err) {
        console.error("Erro ao buscar paciente:", err);
        document.getElementById("status").textContent = "Erro ao conectar com a API.";
    } finally {
        setLoading(btn, false);
    }
}

async function BuscarBinariaPorId() {
    const btn = document.getElementById("btnBuscaBinaria");
    try {
        const id = document.getElementById("buscaId").value;
        if (!id || Number(id) <= 0) {
            alert("Informe um ID válido.");
            return;
        }
        setLoading(btn, true);
        const r = await fetch(`${API}/clinica/buscar-binaria/${id}`);
        if (!r.ok) throw new Error("Paciente não encontrado.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Busca binária realizada.";
    } catch (err) {
        console.error("Erro ao buscar paciente:", err);
        document.getElementById("status").textContent = "Erro ao realizar busca binária.";
    } finally {
        setLoading(btn, false);
    }
}

async function BuscarOrdenadoAZBubbleSort() {
    const btn = document.getElementById("btnBubbleSort");
    setLoading(btn, true);
    try {
        const r = await fetch(`${API}/clinica/buscar-ordenado-a-z-bubblesort`);
        if (!r.ok) throw new Error("Erro no Bubble Sort.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Ordenação A-Z realizada com Bubble Sort.";
    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent = "Erro ao executar Bubble Sort.";
    } finally {
        setLoading(btn, false);
    }
}

async function BuscarOrdenadoIdadeQuickSort() {
    const btn = document.getElementById("btnQuickSort");
    setLoading(btn, true);
    try {
        const r = await fetch(`${API}/clinica/buscar-ordenado-idade-quicksort`);
        if (!r.ok) throw new Error("Erro no Quick Sort.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Ordenação por idade realizada com Quick Sort.";
    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent = "Erro ao executar Quick Sort.";
    } finally {
        setLoading(btn, false);
    }
}

async function BuscarOrdenadoIdadeSelecao() {
    const btn = document.getElementById("btnSelecaoIdade");
    setLoading(btn, true);
    try {
        const r = await fetch(`${API}/clinica/buscar-ordenado-idade-selecao`);
        if (!r.ok) throw new Error("Erro no Selection Sort.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Ordenação por idade realizada com Selection Sort.";
    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent = "Erro ao executar Selection Sort.";
    } finally {
        setLoading(btn, false);
    }
}

async function BuscarTop3PrioritariosSelecao() {
    const btn = document.getElementById("btnTop3");
    setLoading(btn, true);
    try {
        const r = await fetch(`${API}/clinica/buscar-top3-prioritarios-selecao`);
        if (!r.ok) throw new Error("Erro ao buscar Top 3.");
        const data = await r.json();
        render(data);
        document.getElementById("status").textContent = "Top 3 pacientes prioritários.";
    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent = "Erro ao buscar Top 3.";
    } finally {
        setLoading(btn, false);
    }
}

async function RestaurarLista() {
    const btn = document.getElementById("btnRestaurar");
    setLoading(btn, true);
    try {
        const r = await fetch(`${API}/clinica/restaurar-lista`, { method: "POST" });
        if (!r.ok) throw new Error("Erro ao restaurar lista");
        await carregarTodos();
        document.getElementById("status").textContent = "Lista restaurada com sucesso!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").textContent = "Erro ao restaurar lista.";
    } finally {
        setLoading(btn, false);
    }
}

async function IncluirPaciente() {
    const btn = document.getElementById("btnCadastrar");
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

        const cpfDigitos = paciente.cpf.replace(/\D/g, "");
        if (cpfDigitos.length !== 11) {
            alert("CPF deve conter 11 dígitos.");
            return;
        }

        setLoading(btn, true);
        const response = await fetch(`${API}/clinica/incluir-paciente`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente)
        });

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
    } finally {
        setLoading(btn, false);
    }
}

async function RemoverPaciente(id, btn) {
    if (!confirm("Deseja realmente remover este paciente?")) return;
    try {
        setLoading(btn, true);
        const response = await fetch(`${API}/clinica/remover-paciente/${id}`, {
            method: "DELETE"
        });
        await response.text();
        await carregarTodos();
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao remover paciente.");
    } finally {
        setLoading(btn, false);
    }
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    IncluirPaciente();
});

aplicarMascaraCPF(document.getElementById("cpf"));

carregarTodos();