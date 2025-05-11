import { criarGraficoCDF, criarGraficoDesvanecimento, criarGraficoFading, criarGraficoPathLoss, criarGraficoPotencia, criarGraficoPotenciaEst, criarGraficoShadowing } from "./functions.js";
import { generateChannel, generateEstimative } from "./requests.js";

let cont = 0;

const btnChannel = document.getElementById("channel");
const graphicContainer = document.getElementById("show-graphics-channel");
const channelResults = document.getElementById("channel-results");

btnChannel.addEventListener("click", async () => {
    
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
    
});

const btnextract = document.getElementById("extract");
btnextract.addEventListener("click", async () => {

    cont++;
    const windowSize = document.getElementById("window-size").value;

    // try {
        const data = await generateEstimative(windowSize);

        const outputEstimation = document.getElementById("output-estimation");
        outputEstimation.style.display = "block";

        const estimationResults = document.getElementById("estimation-results");

        const card = createCard(windowSize, data, cont);
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

function createCard(windowSize, data, cont) {
    const card = document.createElement("div");
    const dataCard = document.createElement("div");
    const dado = data.estimativa_parametros
    card.appendChild(dataCard);
    dataCard.innerHTML = `
        <h3>Resultados da Estimativa:</h3>
        <p>Estimação dos parâmetros (W = ${windowSize}):</p>
        <p>Expoente de path loss estimado = ${dado.expoente_path_loss_estimado}</p>
        <p>Desvio padrão do sombreamento estimado (sigma) = ${dado.desvio_padrao_sombreamento_estimado}</p>
        <p>m de Nakagami = ${dado.m_nakagami}</p>
        <p>Média do sombreamento estimado = ${dado.media_sombreamento_estimado}</p>
        <p>MSE Shadowing = ${dado.mse_shadowing}</p>
        <p>MSE Fading = ${dado.mse_fading}</p>
    `;

    const graphic1 = document.createElement("div");
    graphic1.id = `containerPotenciaEst${cont}`;
    card.appendChild(graphic1);

    const graphic2 = document.createElement("div");
    graphic2.id = `containerPathLossEst${cont}`;
    card.appendChild(graphic2);

    const graphic3 = document.createElement("div");
    graphic3.id = `containerShadowingEst${cont}`;
    card.appendChild(graphic3);

    const graphic4 = document.createElement("div");
    graphic4.id = `containerFadingEst${cont}`;
    card.appendChild(graphic4);

    const graphic5 = document.createElement("div");
    graphic5.id = `containerCDF${cont}`;
    card.appendChild(graphic5);

    return card;
}