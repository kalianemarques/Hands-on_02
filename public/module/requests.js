const API_URL = 'http://localhost:3001/api';

export async function generateChannel (m, n, sigma) {
    try {
        const response = await fetch(`${API_URL}/channel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ m, n, sigma }),
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar o canal');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function generateEstimative (windowSize) {
    try {
        const response = await fetch(`${API_URL}/estimative`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ windowSize }),
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar o canal');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro: ${error.message}`); // Exibe o erro para o usuário
        throw error;
    }
}