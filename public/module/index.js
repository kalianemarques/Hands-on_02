import { createCard, criarGraficoCDF, criarGraficoDesvanecimento, criarGraficoFading, criarGraficoPathLoss, criarGraficoPotencia, criarGraficoPotenciaEst, criarGraficoShadowing } from "./functions.js";
import { generateChannel, generateEstimative } from "./requests.js";

let cont = 0;
let vetWindowSize = [];

const btnChannel = document.getElementById("channel");
const btnExtract = document.getElementById("extract");
const windowSize = document.getElementById("window-size");
const graphicContainer = document.getElementById("show-graphics-channel");
const channelResults = document.getElementById("channel-results");
const outputEstimation = document.getElementById("output-estimation");
const estimationResults = document.getElementById("estimation-results");

btnChannel.addEventListener("click", async () => {
    outputEstimation.style.display = "none";
    estimationResults.innerHTML = "";
    vetWindowSize = [];

    const m = document.getElementById("m").value;
    const n = document.getElementById("n").value;
    const sigma = document.getElementById("sigma").value;
    const showGraphic = document.getElementById("show-graphic").checked; 

    cont = 0;
    graphicContainer.style.display = "none";
    channelResults.innerHTML = "";
    
    if (!m || !n || !sigma) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const data = await generateChannel(m, n, sigma);

    const outputChannel = document.getElementById("output-channel");
    outputChannel.style.display = "block";
    
    channelResults.innerHTML = `
        <h3>Resultados do Canal:</h3>
        <p>Expoente de path loss: ${data.canal_sintetico.expoente_path_loss}</p>
        <p>Desvio padrão do sombreamento (sigma): ${data.canal_sintetico.desvio_padrao_sombreamento}</p>
        <p>m de Nakagami: ${data.canal_sintetico.m_nakagami}</p>
        <p>Média do sombreamento: ${data.canal_sintetico.media_sombreamento}</p>
    `;
    
    if (showGraphic) { 
        graphicContainer.style.display = "block";
        
        criarGraficoDesvanecimento("graficoDesvanecimento", data);
        criarGraficoPotencia("graficoPotencia", data);
    }
    btnExtract.disabled = false;
});

btnExtract.addEventListener("click", async () => {
    cont++;
    const value = windowSize.value;
    
    if (vetWindowSize.includes(value)) {
        alert("Tamanho da janela já inserido");
        return;
    }
    
    vetWindowSize.push(value);
    
    // try {
        const data = await generateEstimative(value);

        outputEstimation.style.display = "block";

        const card = createCard(value, data, cont);
        card.classList.add("card");
        estimationResults.appendChild(card);

        criarGraficoPotenciaEst(`containerPotenciaEst${cont}`, data.grafico_potencia);
        criarGraficoPathLoss(`containerPathLossEst${cont}`, data.grafico_path_loss);
        criarGraficoShadowing(`containerShadowingEst${cont}`, data.grafico_shadowing);
        criarGraficoFading(`containerFadingEst${cont}`, data.grafico_fading);
        criarGraficoCDF(`containerCDF${cont}`, data.grafico_cdf);

    // } catch (error) {
    //     console.error("Erro ao gerar estimativa: O tamanho da janela é muito pequeno");
    // }
   
});

windowSize.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        btnExtract.click();
    }
});

document.getElementById("m").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        btnChannel.click();
    }
});