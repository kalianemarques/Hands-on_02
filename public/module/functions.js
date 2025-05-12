// -> funções de criação de gráficos

export function criarGraficoDesvanecimento(containerId, dados) {
    // Dados do histograma e PDF teórica
    const histograma = dados.grafico_desvanecimento.histograma;
    const pdf = dados.grafico_desvanecimento.pdf_teorica;
    
    // Configurações do gráfico
    const margin = {top: 20, right: 40, bottom: 40, left: 50};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Limpar o container existente
    d3.select(`#${containerId}`).html("");
    
    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(histograma.bin_centers), d3.max(histograma.bin_centers)])
        .range([0, width]);
    
    const yHist = d3.scaleLinear()
        .domain([0, d3.max(histograma.counts)])
        .range([height, 0]);
    
    const yPdf = d3.scaleLinear()
        .domain([0, d3.max(pdf.y_pdf)])
        .range([height, 0]);
    
    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(yHist));
    
    // Adicionar eixo direito para a PDF
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yPdf));
    
    // Barras do histograma
    svg.selectAll(".bar")
        .data(histograma.bin_centers)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d) - (x(histograma.bin_centers[1]) - x(histograma.bin_centers[0])) / 2)
        .attr("y", (d, i) => yHist(histograma.counts[i]))
        .attr("width", (x(histograma.bin_centers[1]) - x(histograma.bin_centers[0])) * 0.9)
        .attr("height", (d, i) => height - yHist(histograma.counts[i]))
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    
    // Linha da PDF teórica
    const line = d3.line()
        .x(d => x(d.x))
        .y(d => yPdf(d.y))
        .curve(d3.curveBasis);
    
    const pdfData = pdf.x_pdf.map((x, i) => ({x, y: pdf.y_pdf[i]}));
    
    svg.append("path")
        .datum(pdfData)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
    
    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Valores");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Frequência/Densidade");
    
    // Legenda dos elementos
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150},20)`);
    
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text("Histograma");
    
    legend.append("path")
        .attr("d", "M0,10 L20,10")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("transform", "translate(0,30)");
    
    legend.append("text")
        .attr("x", 24)
        .attr("y", 30)
        .attr("dy", ".35em")
        .text("PDF Teórica");
}

export function criarGraficoPotencia(containerId, dados) {
    // Dados de potência
    const dist_log = dados.grafico_potencia.dist_log;
    const prx_completo = dados.grafico_potencia.prx_completo;
    const prx_path_loss = dados.grafico_potencia.prx_path_loss;
    const prx_path_loss_shadowing = dados.grafico_potencia.prx_path_loss_shadowing;
    
    // Configurações do gráfico
    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Limpar o container existente
    d3.select(`#${containerId}`).html("");
    
    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dist_log), d3.max(dist_log)])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(prx_completo), d3.max(prx_completo)])
        .range([height, 0]);
    
    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // Adicionar pontos para prx_completo
    svg.selectAll(".dot-completo")
        .data(dist_log.map((d, i) => ({x: d, y: prx_completo[i]})))
        .enter()
        .append("circle")
        .attr("class", "dot-completo")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 1.5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.3);
    
    // Adicionar linha para prx_path_loss
    const linePathLoss = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
    
    const pathLossData = dist_log.map((d, i) => ({x: d, y: prx_path_loss[i]}));
    
    svg.append("path")
        .datum(pathLossData)
        .attr("class", "line-path-loss")
        .attr("d", linePathLoss)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
    
    // Adicionar linha para prx_path_loss_shadowing
    const lineShadowing = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
    
    const shadowingData = dist_log.map((d, i) => ({x: d, y: prx_path_loss_shadowing[i]}));
    
    svg.append("path")
        .datum(shadowingData)
        .attr("class", "line-shadowing")
        .attr("d", lineShadowing)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2);
    
    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Distância (log)");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Potência Recebida (dBm)");
    
    // Legenda dos elementos
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},20)`);
    
    legend.append("circle")
        .attr("cx", 9)
        .attr("cy", 9)
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    
    legend.append("text")
        .attr("x", 20)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text("PRX Completo");
    
    legend.append("path")
        .attr("d", "M0,20 L20,20")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
    
    legend.append("text")
        .attr("x", 24)
        .attr("y", 20)
        .attr("dy", ".35em")
        .text("Path Loss");
    
    legend.append("path")
        .attr("d", "M0,35 L20,35")
        .attr("stroke", "green")
        .attr("stroke-width", 2);
    
    legend.append("text")
        .attr("x", 24)
        .attr("y", 35)
        .attr("dy", ".35em")
        .text("Path Loss + Shadowing");
}

export function criarGraficoCDF(containerId, dados) {
    // Verificação dos dados
    if (!dados || !dados.x_cdf_est || !dados.y_cdf_est || !dados.x_cdf_teorica || !dados.y_cdf_teorica) {
        console.error("Dados incompletos para gráfico CDF");
        return;
    }

    // Configurações do gráfico
    const margin = {top: 40, right: 30, bottom: 40, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Limpar container
    d3.select(`#${containerId}`).html("");

    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar título do gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15) 
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Estudo do fading com o conhecimento da distribuição");

    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dados.x_cdf_teorica), d3.max(dados.x_cdf_teorica)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Linha para CDF estimada
    const lineEst = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

    const cdfEstData = dados.x_cdf_est.map((x, i) => ({x, y: dados.y_cdf_est[i]}));

    svg.append("path")
        .datum(cdfEstData)
        .attr("class", "line-cdf-est")
        .attr("d", lineEst)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Linha para CDF teórica
    const lineTeorica = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

    const cdfTeoricaData = dados.x_cdf_teorica.map((x, i) => ({x, y: dados.y_cdf_teorica[i]}));

    svg.append("path")
        .datum(cdfTeoricaData)
        .attr("class", "line-cdf-teorica")
        .attr("d", lineTeorica)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Valores (dB)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Probabilidade");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},30)`);

    legend.append("rect")
        .attr("x", -10)
        .attr("y", -10)
        .attr("width", 160)
        .attr("height", 70) 
        .attr("fill", "white")
        .attr("opacity", 0.8) 
        .attr("rx", 5) 
        .attr("ry", 5); 

    legend.append("path")
        .attr("d", "M0,10 L30,10")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("CDF Estimada");

    legend.append("path")
        .attr("d", "M0,30 L30,30")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

    legend.append("text")
        .attr("x", 35)
        .attr("y", 30)
        .attr("dy", "0.35em")
        .text("CDF Teórica");
}

export function criarGraficoFading(containerId, dados) {
    // Verificação dos dados
    if (!dados || !dados.dist_log || !dados.fading_original || !dados.fading_est) {
        console.error("Dados incompletos para gráfico de Fading");
        return;
    }

    // Configurações
    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Limpar container
    d3.select(`#${containerId}`).html("");

    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar título do gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15) 
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Fading Original vs Estimado");

    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dados.dist_log), d3.max(dados.dist_log)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min([...dados.fading_original, ...dados.fading_est]),
        d3.max([...dados.fading_original, ...dados.fading_est])])
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Linha para fading original
    const lineOriginal = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.fading_original[i]));

    svg.append("path")
        .datum(dados.fading_original)
        .attr("class", "line-fading-original")
        .attr("d", lineOriginal)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Linha para fading estimado
    const lineEst = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.fading_est[i]));

    svg.append("path")
        .datum(dados.fading_est)
        .attr("class", "line-fading-est")
        .attr("d", lineEst)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Distância (log)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Fading (dB)");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},30)`);
    
        legend.append("rect")
        .attr("x", -10)
        .attr("y", -10)
        .attr("width", 175)
        .attr("height", 70) 
        .attr("fill", "white")
        .attr("opacity", 0.8) 
        .attr("rx", 5) 
        .attr("ry", 5); 

    legend.append("path")
        .attr("d", "M0,10 L30,10")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("Fading Original");

    legend.append("path")
        .attr("d", "M0,30 L30,30")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 30)
        .attr("dy", "0.35em")
        .text("Fading Estimado");
}

export function criarGraficoPathLoss(containerId, dados) {
    // Verificação dos dados
    if (!dados || !dados.dist_log || !dados.path_loss_original || !dados.path_loss_est) {
        console.error("Dados incompletos para gráfico de Path Loss");
        return;
    }

    // Configurações
    const margin = {top: 40, right: 30, bottom: 40, left: 50};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Limpar container
    d3.select(`#${containerId}`).html("");

    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar título do gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Perda de percurso original vs estimada");

    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dados.dist_log), d3.max(dados.dist_log)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min([...dados.path_loss_original, ...dados.path_loss_est]), 
                d3.max([...dados.path_loss_original, ...dados.path_loss_est])])
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Linha para path loss original
    const lineOriginal = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.path_loss_original[i]));

    svg.append("path")
        .datum(dados.path_loss_original)
        .attr("class", "line-path-loss-original")
        .attr("d", lineOriginal)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Linha para path loss estimado
    const lineEst = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.path_loss_est[i]));

    svg.append("path")
        .datum(dados.path_loss_est)
        .attr("class", "line-path-loss-est")
        .attr("d", lineEst)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Distância (log)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Path Loss (dB)");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},30)`);

    legend.append("rect")
        .attr("x", -10)
        .attr("y", -10)
        .attr("width", 200)
        .attr("height", 70) 
        .attr("fill", "white")
        .attr("opacity", 0.8) 
        .attr("rx", 5) 
        .attr("ry", 5); 

    legend.append("path")
        .attr("d", "M0,10 L30,10")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("Path Loss Original");

    legend.append("path")
        .attr("d", "M0,30 L30,30")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

    legend.append("text")
        .attr("x", 35)
        .attr("y", 30)
        .attr("dy", "0.35em")
        .text("Path Loss Estimado");
}

export function criarGraficoPotenciaEst(containerId, dados) {
    // Verificação dos dados
    if (!dados || !dados.dist_log_est || !dados.prx_est || !dados.path_loss_est || !dados.path_loss_shadowing_est) {
        console.error("Dados incompletos para gráfico de Potência Estimada");
        return;
    }

    // Configurações
    const margin = {top: 40, right: 30, bottom: 40, left: 50};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Limpar container
    d3.select(`#${containerId}`).html("");

    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar título do gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15) 
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Prx original vs estimada");

    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dados.dist_log_est), d3.max(dados.dist_log_est)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min([...dados.prx_est, ...dados.path_loss_est, ...dados.path_loss_shadowing_est]), 
                d3.max([...dados.prx_est, ...dados.path_loss_est, ...dados.path_loss_shadowing_est])])
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Linha para PRX estimado
    const linePrxEst = d3.line()
        .x((d, i) => x(dados.dist_log_est[i]))
        .y((d, i) => y(dados.prx_est[i]));

    svg.append("path")
        .datum(dados.prx_est)
        .attr("class", "line-prx-est")
        .attr("d", linePrxEst)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Linha para Path Loss estimado
    const linePathLossEst = d3.line()
        .x((d, i) => x(dados.dist_log_est[i]))
        .y((d, i) => y(dados.path_loss_est[i]));

    svg.append("path")
        .datum(dados.path_loss_est)
        .attr("class", "line-path-loss-est")
        .attr("d", linePathLossEst)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Linha para Path Loss + Shadowing estimado
    const linePathLossShadowingEst = d3.line()
        .x((d, i) => x(dados.dist_log_est[i]))
        .y((d, i) => y(dados.path_loss_shadowing_est[i]));

    svg.append("path")
        .datum(dados.path_loss_shadowing_est)
        .attr("class", "line-path-loss-shadowing-est")
        .attr("d", linePathLossShadowingEst)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2);

    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Distância (log)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Potência (dBm)");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 300},30)`);

    legend.append("rect")
        .attr("x", -10)
        .attr("y", -10)
        .attr("width", 300)
        .attr("height", 80) 
        .attr("fill", "white")
        .attr("opacity", 0.8) 
        .attr("rx", 5) 
        .attr("ry", 5); 

    legend.append("path")
        .attr("d", "M0,10 L30,10")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("PRX Estimado");

    legend.append("path")
        .attr("d", "M0,30 L30,30")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 30)
        .attr("dy", "0.35em")
        .text("Path Loss Estimado");

    legend.append("path")
        .attr("d", "M0,50 L30,50")
        .attr("stroke", "green")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 50)
        .attr("dy", "0.35em")
        .text("Path Loss + Shadowing Estimado");
}

export function criarGraficoShadowing(containerId, dados) {
    // Verificação dos dados
    if (!dados || !dados.dist_log || !dados.shadowing_original || !dados.shadowing_est) {
        console.error("Dados incompletos para gráfico de Shadowing");
        return;
    }

    // Configurações - aumentei a margem superior para o título
    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Limpar container
    d3.select(`#${containerId}`).html("");

    // Criar SVG
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar título do gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15) 
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Sombreamento Original vs Estimado");

    // Escalas
    const x = d3.scaleLinear()
        .domain([d3.min(dados.dist_log), d3.max(dados.dist_log)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min([...dados.shadowing_original, ...dados.shadowing_est]),
        d3.max([...dados.shadowing_original, ...dados.shadowing_est])])
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Linha para shadowing original
    const lineOriginal = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.shadowing_original[i]));

    svg.append("path")
        .datum(dados.shadowing_original)
        .attr("class", "line-shadowing-original")
        .attr("d", lineOriginal)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Linha para shadowing estimado
    const lineEst = d3.line()
        .x((d, i) => x(dados.dist_log[i]))
        .y((d, i) => y(dados.shadowing_est[i]));

    svg.append("path")
        .datum(dados.shadowing_est)
        .attr("class", "line-shadowing-est")
        .attr("d", lineEst)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Legendas
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Distância (log)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Shadowing (dB)");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},30)`);

    legend.append("rect")
        .attr("x", -10)
        .attr("y", -10)
        .attr("width", 210)
        .attr("height", 70) 
        .attr("fill", "white")
        .attr("opacity", 0.8) 
        .attr("rx", 5) 
        .attr("ry", 5); 

    legend.append("path")
        .attr("d", "M0,10 L30,10")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("Shadowing Original");

    legend.append("path")
        .attr("d", "M0,30 L30,30")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 30)
        .attr("dy", "0.35em")
        .text("Shadowing Estimado");
}


// -> funcao para criar o card de resultados
export function createCard(windowSize, data, cont) {
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