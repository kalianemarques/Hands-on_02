import numpy as np
import sys
import json
from scipy.special import gamma
from fGenerateChannel import GenerateChannel

# Receber parâmetros da linha de comando
if len(sys.argv) < 4:
    print("Uso: python TriggerGenerate.py <m-nakagami> <n-pathloss> <sigma>")
    sys.exit(1)

m = float(sys.argv[1])          # Parâmetro M de Nakagami
n = float(sys.argv[2])          # Expoente de perda de percurso (pathloss)
sigma = float(sys.argv[3])      # Desvio padrão do shadowing em dB

GenerateChannel(m,n,sigma)

# Carregar os dados do canal gerado
datachannel = np.load('dados_canal.npz')
vtDist = datachannel['vtDist']
vtPathLoss = datachannel['vtPathLoss']
vtShadCorr = datachannel['vtShadCorr']
vtFading = datachannel['vtFading']
vtPrxdBm = datachannel['vtPrxdBm']
vtNakagamiNormEnvelope = datachannel['vtNakagamiNormEnvelope']

# Dados do canal sintético
canal_sintetico = {
    "expoente_path_loss": n,
    "desvio_padrao_sombreamento": float(np.std(vtShadCorr)),
    "m_nakagami": m,
    "media_sombreamento": float(np.mean(vtShadCorr))
}

# Dados para o gráfico de potência
grafico_potencia = {
    "dist_log": np.log10(vtDist).tolist(),
    "prx_completo": vtPrxdBm.tolist(),
    "prx_path_loss": (-vtPathLoss).tolist(),
    "prx_path_loss_shadowing": (-vtPathLoss + vtShadCorr).tolist()
}

# Dados para o gráfico de desvanecimento de pequena escala (PDF e histograma)
counts, bins = np.histogram(vtNakagamiNormEnvelope, bins=100, density=True)
bin_centers = (bins[:-1] + bins[1:]) / 2
x_pdf = np.linspace(0, max(bins), 100)
y_pdf = (2 * m**m / gamma(m)) * x_pdf**(2 * m - 1) * np.exp(-m * x_pdf**2)

grafico_desvanecimento = {
    "histograma": {
        "bin_centers": bin_centers.tolist(),
        "counts": counts.tolist()
    },
    "pdf_teorica": {
        "x_pdf": x_pdf.tolist(),
        "y_pdf": y_pdf.tolist()
    }
}

# Combinar os dados em um único JSON
resultado = {
    "canal_sintetico": canal_sintetico,
    "grafico_potencia": grafico_potencia,
    "grafico_desvanecimento": grafico_desvanecimento
}

# Retornar o JSON
print(json.dumps(resultado, indent=4))