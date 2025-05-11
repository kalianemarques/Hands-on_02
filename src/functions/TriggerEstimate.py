import numpy as np
import sys
from scipy.stats import gamma, nakagami
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error
from fEstimateChannel import EstimateChannel

# Receber parâmetros da linha de comando
if len(sys.argv) < 2:
    print("Uso: python TriggerEstimate.py <Tamanho da janela de correlação>")
    sys.exit(1)

shadowingWindow = float(sys.argv[1])

# Carrega os dados salvos no arquivo .npz
datachannel = np.load('dados_canal.npz')

#EstimateChannel(shadowingWindow, datachannel)
sOut = EstimateChannel(shadowingWindow, datachannel)
vtMSEShad = []
vtMSEFad = []
dW = shadowingWindow
txPower = 0
vtDistEst = sOut['vtDistEst']
vtPathLossEst = sOut['vtPathLossEst']
dNEst = sOut['dNEst']
vtShadCorrEst = sOut['vtShadCorrEst']
dStdShadEst = sOut['dStdShadEst']
dStdMeanShadEst = sOut['dStdMeanShadEst']
vtDesPequeEst = sOut['vtDesPequeEst']
vtPrxEst = sOut['vtPrxEst']
vtXCcdfEst = sOut['vtXCcdfEst']
vtYCcdfEst = sOut['vtYCcdfEst']
vtDistLogEst =np.log10(vtDistEst)
vtDistLog = np.log10(datachannel['vtDist'])
dMeiaJanela = round((dW - 1) / 2)
len_min = min(len(datachannel['vtShadCorr']), len(vtShadCorrEst))
mse_shad = mean_squared_error(datachannel['vtShadCorr'][dMeiaJanela+1:-dMeiaJanela], vtShadCorrEst)
vtMSEShad.append(mse_shad)
mse_fad = mean_squared_error(vtDesPequeEst, datachannel['vtFading'][dMeiaJanela+1:-dMeiaJanela])
vtMSEFad.append(mse_fad)
m, loc_nak, omega = nakagami.fit(sOut['vtEnvNorm'], floc=0)
xCDF = 10 ** (sOut['vtXCcdfEst'] / 20)
cdfnaka = gamma.cdf(round(m)*xCDF**2, round(m))
if np.any(np.isnan(sOut['vtYCcdfEst'])) or np.any(np.isnan(cdfnaka)):
   mse_fad_cdf = np.nan
else:
   mse_fad_cdf = mean_squared_error(cdfnaka, sOut['vtYCcdfEst'])















# ------ teste temporário -------REMOVER-------------

print(f'   Estimação dos parâmetros (W = {dW}):')
print(f'   Expoente de path loss estimado = {round(sOut['dNEst'])} ({sOut['dNEst']})')
print(f'   Desvio padrão do sombreamento estimado (sigma) = {sOut['dStdShadEst']}')
print(f'   m de Nakagami = {round(m)} ({m})')
print(f'   Média do sombreamento estimado = {sOut["dStdMeanShadEst"]}')
print(f'   MSE Shadowing = {mse_shad}')
print(f'   MSE Fading = {mse_fad_cdf}')
print('----\n')


plt.figure()
plt.plot(vtDistLogEst, vtPrxEst, label='Prx canal completo original', linewidth=1)
plt.plot(vtDistLogEst, -vtPathLossEst, label='Prx (somente path loss) estimado', color='red', linewidth=1)
plt.plot(vtDistLogEst, -vtPathLossEst + vtShadCorrEst, label='Prx (path loss + shadowing) estimado', color='yellow', linewidth=1)
plt.xlabel('log10(d)')
plt.ylabel('Potência [dBm]')
plt.title('Prx original vs estimada')
plt.xlim([0.7, 1.6])
plt.legend()
plt.grid(True)

plt.figure()
plt.plot(vtDistLog, -datachannel['vtPathLoss'], label='Path Loss original', linewidth=1)
plt.plot(vtDistLogEst, -vtPathLossEst, label='Path Loss estimado', linewidth=1)
plt.title('Perda de percurso original vs estimada')
plt.legend()
plt.xlim([0.7, 1.6])
plt.grid(True)

plt.figure()
plt.plot(vtDistLog, datachannel['vtShadCorr'], label='Shadowing original', linewidth=1)
plt.plot(vtDistLogEst, vtShadCorrEst, label='Shadowing estimado', linewidth=1)
plt.title('Sombreamento original vs estimado')
plt.xlim([0.7, 1.6])
plt.legend()
plt.grid(True)

plt.figure()
plt.plot(vtDistLog, datachannel['vtFading'], label='Fading original', linewidth=1)
plt.plot(vtDistLogEst, vtDesPequeEst, label='Fading estimado', linewidth=1)
plt.title('Fading original vs estimado')
plt.xlim([0.7, 1.6])
plt.legend()
plt.grid(True)

plt.figure()
plt.plot(sOut['vtXCcdfEst'], sOut['vtYCcdfEst'], 'o-', label='CCDF estimada', linewidth=1)
plt.plot(20 * np.log10(xCDF), cdfnaka, '--', label='CDF Nakagami teórica', linewidth=1)
plt.title('CDF teórica e estimada')
plt.legend()
plt.xlabel('x')
plt.ylabel('F(x)')
plt.axis([-10, 10, 1e-5, 1])
plt.grid(True, which='both')

plt.show()