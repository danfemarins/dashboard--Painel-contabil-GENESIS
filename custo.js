
const dados = JSON.parse(localStorage.getItem('dados')) || [];
const dadosSaida = JSON.parse(localStorage.getItem('dadosSaida')) || [];

// Função para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem('dados', JSON.stringify(dados));
    localStorage.setItem('dadosSaida', JSON.stringify(dadosSaida));
}

// Função para atualizar os relatórios com os dados do localStorage
function atualizarRelatorios() {
    atualizarRelatorioEntrada();
    atualizarRelatorioSaida();
}

// Função para atualizar o relatório de entrada
function atualizarRelatorioEntrada() {
    const tabela = document.getElementById('dados');
    const totalEntradaElement = document.getElementById('total-entrada');
    tabela.innerHTML = '';
    let totalEntrada = 0;
    for (let i = 0; i < dados.length; i++) {
        const entrada = dados[i];
        tabela.innerHTML += `
            <tr>
                <td>${entrada.data}</td>
                <td>${entrada.descricao}</td>
                <td>R$${entrada.valor.toFixed(2)}</td>
                <td><button class="remove-button" onclick="removerEntrada(${i})">Remover</button></td>
            </tr>
        `;
        totalEntrada += entrada.valor;
    }
    totalEntradaElement.innerText = `Total Entrada: R$${totalEntrada.toFixed(2)}`;
}

// Função para atualizar o relatório de saída
function atualizarRelatorioSaida() {
    const tabelaSaida = document.getElementById('dados-saida');
    const totalSaidaElement = document.getElementById('total-saida');
    tabelaSaida.innerHTML = '';
    let totalSaida = 0;
    for (let i = 0; i < dadosSaida.length; i++) {
        const saida = dadosSaida[i];
        tabelaSaida.innerHTML += `
            <tr>
                <td>${saida.data}</td>
                <td>${saida.descricao}</td>
                <td>R$${saida.valor.toFixed(2)}</td>
                <td><button class="remove-button" onclick="removerSaida(${i})">Remover</button></td>
            </tr>
        `;
        totalSaida += saida.valor;
    }
    totalSaidaElement.innerText = `Total Saída: R$${totalSaida.toFixed(2)}`;
}

// Função para adicionar entrada
function adicionarEntrada() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (descricao && !isNaN(valor)) {
        const data = new Date().toLocaleString();
        dados.push({ data, descricao, valor });
        salvarDados();
        atualizarRelatorioEntrada();
        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';
    }
}

// Função para adicionar saída
function adicionarSaida() {
    const descricao = document.getElementById('descricao-saida').value;
    const valor = parseFloat(document.getElementById('valor-saida').value);

    if (descricao && !isNaN(valor)) {
        const data = new Date().toLocaleString();
        dadosSaida.push({ data, descricao, valor });
        salvarDados();
        atualizarRelatorioSaida();
        document.getElementById('descricao-saida').value = '';
        document.getElementById('valor-saida').value = '';
    }
}

// Função para remover entrada
function removerEntrada(index) {
    if (confirm('Tem certeza de que deseja remover esta entrada?')) {
        dados.splice(index, 1);
        salvarDados();
        atualizarRelatorioEntrada();
    }
}

// Função para remover saída
function removerSaida(index) {
    if (confirm('Tem certeza de que deseja remover esta saída?')) {
        dadosSaida.splice(index, 1);
        salvarDados();
        atualizarRelatorioSaida();
    }
}

// Função para calcular o total
function calcularTotal(dataArray) {
    return dataArray.reduce((total, item) => total + item.valor, 0);
}

function exportarDados(tipo) {
    let dadosParaExportar = [];
    let tituloRelatorio = '';

    if (tipo === 'entrada') {
        dadosParaExportar = dados;
        tituloRelatorio = 'Relatório de Entradas';
    } else if (tipo === 'saida') {
        dadosParaExportar = dadosSaida;
        tituloRelatorio = 'Relatório de Saídas';
    }

    // Crie um texto com os dados formatados
    let textoExportacao = `${tituloRelatorio}\n\n`;
    textoExportacao += 'Data\tDescrição\tValor\n';
    dadosParaExportar.forEach(item => {
        textoExportacao += `${item.data}\t${item.descricao}\tR$${item.valor.toFixed(2)}\n`;
    });
    textoExportacao += `\nTotal ${tipo === 'entrada' ? 'Entrada' : 'Saída'}: R$${calcularTotal(dadosParaExportar).toFixed(2)}`;

    // Crie um objeto Blob para salvar o texto como arquivo
    const blob = new Blob([textoExportacao], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Crie um link para fazer o download do arquivo
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipo}_relatorio.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Libere o objeto URL
    window.URL.revokeObjectURL(url);
}

// Atualizar os relatórios quando a página for carregada
window.addEventListener('load', () => {
    atualizarRelatorios();
});
