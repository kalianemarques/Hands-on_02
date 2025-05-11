const { spawn } = require('child_process');
const path = require('path');

function executePython(script, params, res) {
    const pythonPath = process.env.PYTHON_PATH;
    const scriptPath = path.join(__dirname, '..', 'functions', script);
    const scriptDir = path.dirname(scriptPath);
    
    // Converter todos os parâmetros para string
    const stringParams = params.map(p => p.toString());
    
    const pythonProcess = spawn(pythonPath, [scriptPath, ...stringParams], { 
        cwd: scriptDir,
        shell: true  // Adicionado para garantir execução em alguns sistemas
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const result = output ? JSON.parse(output) : { error: "Nenhuma saída recebida do script Python" };
                res.json(result);
            } catch (err) {
                console.error(`Erro ao parsear saída: ${err}\nSaída: ${output}\nErros: ${errorOutput}`);
                res.status(500).json({ 
                    error: 'Erro ao processar a saída do script Python',
                    pythonError: errorOutput,
                    output: output
                });
            }
        } else {
            console.error(`Script Python falhou com código ${code}\nErros: ${errorOutput}`);
            try {
                const errorResult = JSON.parse(errorOutput);
                res.status(400).json(errorResult); // Retorna o erro específico do script Python
            } catch (err) {
                res.status(500).json({ 
                    error: 'Erro ao executar o script Python',
                    pythonError: errorOutput,
                    exitCode: code
                });
            }
        }
    });
    
    pythonProcess.on('error', (err) => {
        console.error('Falha ao iniciar processo Python:', err);
        res.status(500).json({ error: 'Falha ao iniciar processo Python', details: err.message });
    });
}

module.exports = { executePython };