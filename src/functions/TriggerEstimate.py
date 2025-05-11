import numpy as np
import sys
import json
from scipy.stats import gamma, nakagami
from sklearn.metrics import mean_squared_error
from fEstimateChannel import EstimateChannel

# Receber parâmetros da linha de comando
if len(sys.argv) < 2:
    print("Uso: python TriggerEstimate.py <Tamanho da janela de correlação>")
    sys.exit(1)

shadowingWindow = float(sys.argv[1])

# Carrega os dados salvos no arquivo .npz
datachannel = np.load('dados_canal.npz')

# Estimação do canal
sOut = EstimateChannel(shadowingWindow, datachannel)
dW = shadowingWindow
vtDistLogEst = np.log10(sOut['vtDistEst'])
vtDistLog = np.log10(datachannel['vtDist'])
dMeiaJanela = round((dW - 1) / 2)

# Verificar se os índices são válidos
if dMeiaJanela + 1 >= len(datachannel['vtShadCorr']) or dMeiaJanela >= len(sOut['vtShadCorrEst']):
    print(json.dumps({"error": "Tamanho da janela de filtragem é muito grande para os dados disponíveis."}, indent=4))
    sys.exit(1)

# Verificar se os tamanhos das variáveis são consistentes
y_true = datachannel['vtShadCorr'][dMeiaJanela+1:-dMeiaJanela]
y_pred = sOut['vtShadCorrEst']

if len(y_true) == 0 or len(y_pred) == 0 or len(y_true) != len(y_pred):
    print(json.dumps({"error": "Os tamanhos das variáveis de entrada são inconsistentes ou vazios."}, indent=4))
    sys.exit(1)

# Cálculo dos erros
mse_shad = mean_squared_error(y_true, y_pred)

# Verificar se os tamanhos das variáveis para o CDF são consistentes
if len(sOut['vtYCcdfEst']) == 0 or len(sOut['vtXCcdfEst']) == 0:
    print(json.dumps({"error": "Os dados para o cálculo do CDF estão vazios ou inconsistentes."}, indent=4))
    sys.exit(1)

m, loc_nak, omega = nakagami.fit(sOut['vtEnvNorm'], floc=0)
xCDF = 10 ** (sOut['vtXCcdfEst'] / 20)
cdfnaka = gamma.cdf(round(m) * xCDF**2, round(m))

if len(sOut['vtYCcdfEst']) != len(cdfnaka):
    mse_fad_cdf = np.nan
else:
    mse_fad_cdf = mean_squared_error(cdfnaka, sOut['vtYCcdfEst'])

# Dados para o JSON
resultado = {
    "estimativa_parametros": {
        "expoente_path_loss_estimado": round(sOut['dNEst']),
        "desvio_padrao_sombreamento_estimado": sOut['dStdShadEst'],
        "m_nakagami": round(m),
        "media_sombreamento_estimado": sOut["dStdMeanShadEst"],
        "mse_shadowing": mse_shad,
        "mse_fading": mse_fad_cdf
    },
    "grafico_potencia": {
        "dist_log_est": vtDistLogEst.tolist(),
        "prx_est": sOut['vtPrxEst'].tolist(),
        "path_loss_est": (-sOut['vtPathLossEst']).tolist(),
        "path_loss_shadowing_est": (-sOut['vtPathLossEst'] + sOut['vtShadCorrEst']).tolist()
    },
    "grafico_path_loss": {
        "dist_log": vtDistLog.tolist(),
        "path_loss_original": (-datachannel['vtPathLoss']).tolist(),
        "path_loss_est": (-sOut['vtPathLossEst']).tolist()
    },
    "grafico_shadowing": {
        "dist_log": vtDistLog.tolist(),
        "shadowing_original": datachannel['vtShadCorr'].tolist(),
        "shadowing_est": sOut['vtShadCorrEst'].tolist()
    },
    "grafico_fading": {
        "dist_log": vtDistLog.tolist(),
        "fading_original": datachannel['vtFading'].tolist(),
        "fading_est": sOut['vtDesPequeEst']
    },
    "grafico_cdf": {
        "x_cdf_est": sOut['vtXCcdfEst'].tolist(),
        "y_cdf_est": sOut['vtYCcdfEst'].tolist(),
        "x_cdf_teorica": (20 * np.log10(xCDF)).tolist(),
        "y_cdf_teorica": cdfnaka.tolist()
    }
}

# Retornar o JSON
print(json.dumps(resultado, indent=4))