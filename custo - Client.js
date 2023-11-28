
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
            </tr>
        `;
        totalSaida += saida.valor;
    }
    totalSaidaElement.innerText = `Total Saída: R$${totalSaida.toFixed(2)}`;
}

// Função para exportar dados como arquivo de texto
function exportarDados(tipo) {
    let dadosExportados;
    if (tipo === 'entrada') {
        dadosExportados = JSON.stringify(dados, null, 2);
    } else if (tipo === 'saida') {
        dadosExportados = JSON.stringify(dadosSaida, null, 2);
    }

    const blob = new Blob([dadosExportados], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipo}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Atualizar os relatórios automaticamente a cada minuto
setInterval(() => {
    atualizarRelatorios();
}, 60000); // 60000 milissegundos = 1 minuto

// Função para atualizar manualmente os relatórios e recarregar a página
function atualizarManualmente() {
    atualizarRelatorios();
    location.reload(); // Recarrega a página
}

// Atualizar os relatórios quando a página for carregada
window.addEventListener('load', () => {
    atualizarRelatorios();
});
