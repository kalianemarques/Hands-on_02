import numpy as np
import sys
import matplotlib.pyplot as plt
from fGenerateChannel import GenerateChannel

# Receber parâmetros da linha de comando
if len(sys.argv) < 4:
    print("Uso: python TriggerGenerate.py <m-nakagami> <n-pathloss> <sigma>")
    sys.exit(1)

m = float(sys.argv[1])          # Parâmetro M de Nakagami
n = float(sys.argv[2])          # Expoente de perda de percurso (pathloss)
sigma = float(sys.argv[3])      # Desvio padrão do shadowing em dB

GenerateChannel(m,n,sigma)






# ------ teste temporário -------REMOVER-------------
datachannel = np.load('dados_canal.npz')
vtDist = datachannel['vtDist']
vtPathLoss = datachannel['vtPathLoss']
vtShadCorr = datachannel['vtShadCorr']
vtFading = datachannel['vtFading']
vtPrxdBm = datachannel['vtPrxdBm']
vtDistLog = np.log10(vtDist)

print('   Canal sintético:')
print(f'   Expoente de path loss = {n}')
print(f'   Desvio padrão do sombreamento (sigma) = {np.std(vtShadCorr)}')
print(f'   m de Nakagami = {m}')
print(f'   Média do sombreamento = {np.mean(vtShadCorr)}')
print('----\n')
plt.figure()
plt.plot(vtDistLog, vtPrxdBm, label='Prx canal completo sintético', linewidth=1)
plt.plot(vtDistLog, -vtPathLoss, label='Prx (somente path loss) sintético', color='red', linewidth=1)
plt.plot(vtDistLog, -vtPathLoss + vtShadCorr, label='Prx (path loss + shadowing) sintético', color='yellow', linewidth=1)
plt.xlabel('log10(d)')
plt.ylabel('Potência [dBm]')
plt.title('Prx original do canal sintético')
plt.legend()
plt.xlim([0.7, 1.6])
plt.grid(True)
plt.show()