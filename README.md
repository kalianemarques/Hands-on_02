# Hands-on 02 - Caracterização de canal banda estreita (modelagem e caracterização do desvanecimento de pequena escala)

Objetivos:

- Gerar uma série temporal sintética com Perda de Percurso, Sombreamento e Desvanecimento m-Nakagami;
- Estimar cada desvanecimento por meio de regressão linear, filtragem e tratamento estatístico;
- Fazer gráficos e comparar as partes geradas sinteticamente e as partes estimadas.

---

## Pré-requisitos

Antes de começar, certifique-se de que sua máquina possui os seguintes softwares instalados:

1. **Node.js** (versão 14 ou superior)
   - [Download Node.js](https://nodejs.org/)
   - O Node.js é necessário para rodar o servidor da aplicação.

2. **Python** (versão 3.8 ou superior)
   - [Download Python](https://www.python.org/downloads/)
   - O Python é necessário para executar os cálculos matemáticos.

3. **Gerenciador de pacotes `pip`** (incluso no Python)
   - O `pip` será usado para instalar as bibliotecas Python necessárias.

4. **Bibliotecas Python necessárias**:
   - `numpy`
   - `scipy`
   - `scikit-learn`
   Para instalar as bibliotecas, siga o passo 4 na seção "Como configurar o projeto".

---

## Como configurar o projeto

Siga os passos abaixo para configurar e iniciar a aplicação:

### Passo 1: Baixar o projeto

1. Faça o download do projeto clicando no botão "Code" no GitHub e selecionando "Download ZIP".
2. Extraia o conteúdo do arquivo ZIP para uma pasta de sua escolha.

**OU**

Se você tiver o Git instalado, clone o repositório e vá para o reposótorio do peojeto:
```bash
git clone https://github.com/kalianemarques/Hands-on_02
cd Hands-on_02
```

---

### Passo 2: Instalar o Node.js

1. Acesse o site oficial do Node.js: [https://nodejs.org/](https://nodejs.org/).
2. Baixe e instale a versão LTS recomendada.
3. Após a instalação, verifique se o Node.js está funcionando:
   ```bash
   node -v
   ```
   O comando acima deve exibir a versão do Node.js instalada.

---

### Passo 3: Instalar o Python

1. Acesse o site oficial do Python: [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Baixe e instale a versão mais recente do Python 3.
3. Durante a instalação, marque a opção **"Add Python to PATH"**.
4. Após a instalação, verifique se o Python está funcionando:
   ```bash
   python --version
   ```
   O comando acima deve exibir a versão do Python instalada.

---

### Passo 4: Instalar as bibliotecas Python

1. Abra o terminal ou prompt de comando.
2. Instale as bibliotecas necessárias com o seguinte comando:
   ```bash
   pip install --user numpy scipy scikit-learn
   ```
3. Verifique se as bibliotecas foram instaladas corretamente:
   ```bash
   pip show numpy scipy scikit-learn
   ```
---

### Passo 5: Configurar o projeto

1. Abra a pasta do projeto no terminal.
2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` com base no arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
4. Edite o arquivo `.env` e configure as variáveis de ambiente:
   ```properties
   PYTHON_PATH=C:\Users\SeuUsuario\AppData\Local\Programs\Python\Python39\python.exe
   PORT=3001
   ```
   Substitua o caminho acima pelo caminho do executável do Python na sua máquina.

---

### Passo 6: Iniciar a aplicação

1. No terminal, inicie o servidor Node.js:
   ```bash
   npm start
   ```
2. Abra o navegador e acesse:
   ```
   http://localhost:3001
   ```

---

## Como usar a aplicação

A aplicação possui duas funcionalidades principais:

1. **Geração de canal sintetico com a possibilidade de gerar ou não os gráficos do canal**:
   - Insira o n do path loss; o sigma do shadowing; e o m de Nakagami. Caso queira  gerar os gráficos do canal gerado basta marcar essa opção no checkbox.

2. **Estimar os dados do canal a partir do tamanho da janela**:
   - Insira o tamanho da janela de filtragem. Deve gerar o canal sintetico antes.


---

## Estrutura do projeto

```
Hands-on_02/
├── public/                # Arquivos estáticos (frontend)
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos CSS
│   ├── module             # scripts javaScript usados no frontend
│   │   ├── index.js           # Lógica do frontend
│   │   ├── requests.js        # Funções de requisição do frontend
│   │   ├── functions.js  # Funções de geração dos gráficos e criação de cards do frontend
├── src/
│   ├── functions/         # Scripts Python
│   │   ├── fEstimateChannel.py    # Função para estimar os parâmetros do canal a partir dos dados sintéticos e gerar variáveis para os gráficos de estimativa.
│   │   ├── fGenerateChannel.py    # Função para gerar um canal sintético com path loss, shadowing e fading (Nakagami), salvando os dados em arquivo.
│   │   ├── TriggerEstimate.py     # Script que executa a estimativa do canal (chama fEstimateChannel.py), processa os dados e retorna o resultado em JSON.
│   │   ├── TriggerGenerate.py     # Script que executa a geração do canal sintético (chama fGenerateChannel.py), processa os dados e retorna o resultado em JSON.
│   │   ├── dados_canal.npz        # Arquivo gerado ao gerar um canal sintetico (depois de chamar fGenerateChannel.py), nele são armazenados os dados do canal. 
│   ├── routes/            # Rotas da API
│   │   ├── apiRoutes.js   # Rotas para comunicação com os scripts Python
│   ├── utils/             # Utilitários
│   │   ├── executePython.js # Função para executar scripts Python
├── server.js              # Configuração do servidor Node.js
├── .env                   # Configurações do ambiente
├── .env.example           # Exemplo de configuração do ambiente
├── package.json           # Dependências do Node.js
```

---

## Problemas comuns

1. **Erro: "PYTHON_PATH não configurado"**:
   - Certifique-se de que o caminho do Python está configurado corretamente no arquivo `.env`.

2. **Erro: "Bibliotecas Python não encontradas"**:
   - Certifique-se de que as bibliotecas `numpy` e `matplotlib` estão instaladas:
     ```bash
     pip install numpy scipy scikit-learn
     ```

3. **Porta em uso**:
   - Se a porta 3001 já estiver em uso, altere a variável `PORT` no arquivo `.env`:
     ```
     PORT=4000
     ```

