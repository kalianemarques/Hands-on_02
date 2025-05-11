import numpy as np
import math as mt
from scipy.stats import nakagami

def GenerateChannel(m,n,sigma):
    m=m
    n=n
    sigma=sigma
    nPoints = 50000                 # Número de amostras da rota de medição
    totalLength = 100               # Distância final da rota de medição
    P0 = 0                          # Potência medida na distância de referência d0 (em dBm)
    d0 = 5                          # Distância de referência d0
    shadowingWindow = 100           # Tamanho da janela de correlação do shadowing
    dMed = totalLength/nPoints      # Distância entre pontos de medição
    txPower = 0

    # Distância do transmissor
    d = np.arange(d0, totalLength, dMed)
    nSamples = len(d)

    # Perda de percurso
    vtPathLoss = P0 + 10*n*np.log10(d/d0)

    # Sombreamento
    nShadowSamples = mt.floor(nSamples / shadowingWindow)
    shadowing = sigma * np.random.randn(nShadowSamples)
    restShadowing = sigma * np.random.randn(1) * np.ones(nSamples % shadowingWindow)
    shadowing = np.tile(shadowing, (shadowingWindow, 1))
    shadowing = shadowing.T.flatten()
    shadowing = np.concatenate((shadowing, restShadowing))

    # Filtro de média móvel
    jan = shadowingWindow // 2
    vtShadCorr = []
    for i in range(jan, nSamples - jan):
        vtShadCorr.append(np.mean(shadowing[i - jan:i + jan + 1]))
    vtShadCorr = np.array(vtShadCorr)

    # Ajuste do desvio padrão
    vtShadCorr *= np.std(shadowing) / np.std(vtShadCorr)
    vtShadCorr += np.mean(shadowing) - np.mean(vtShadCorr)
    vtNakagamiNormEnvelope = nakagami.rvs(m, size=nSamples)
    # Fading em dB
    vtNakagamiSampdB = 20 * np.log10(vtNakagamiNormEnvelope)

    # Ajuste de tamanho por causa da filtragem
    txPowerVec = txPower * np.ones(nSamples)
    txPowerVec = txPowerVec[jan:nSamples-jan]
    vtPathLoss = vtPathLoss[jan:nSamples-jan]
    vtFading = vtNakagamiSampdB[jan:nSamples-jan]
    vtDist = d[jan:nSamples-jan]

    # Potência recebida
    vtPrxdBm = txPowerVec - vtPathLoss + vtShadCorr + vtFading
    
    # ---------- Salvamento dos dados em arquivo .npz ----------
    np.savez("dados_canal.npz",
         vtDist=vtDist,
         vtPathLoss=vtPathLoss,
         vtShadCorr=vtShadCorr,
         vtFading=vtFading,
         vtPrxdBm=vtPrxdBm)

    return vtDist, vtPathLoss, vtShadCorr, vtFading, vtPrxdBm

    # vtDist:  vetor do eixo x na plotagem usar "np.log10(vtDist)"
    # vtPathLoss: vetor do eixo y para plotar PathLoss (usar ele negativo na plotagem)
    # vtShadCorr: vetor do eixo y para plotar Shadowing (sombreamento)
    # vtFading: vetor do eixo y para plotar Fading (desvanecimento de pequena escala)
    # vtPrxdBm: vetor do eixo y para plotar o canal sintético completo
