const express = require('express');
const router = express.Router();
const { executePython } = require('../utils/executePython');

router.post('/channel', (req, res) => {
    const { m, n, sigma } = req.body; 
    if (!m || !n || !sigma) {
        return res.status(400).json({ error: 'Parâmetros "m", "n" e "sigma" são obrigatórios.' });
    }
    executePython('TriggerGenerate.py', [m, n, sigma], res);
});


router.post('/estimative', (req, res) => {
    const { windowSize } = req.body; 
    if (! windowSize) {
        return res.status(400).json({ error: 'Parâmetro "windowSize" é  obrigatório.' });
    }
    executePython('TriggerEstimate.py', [windowSize], res); 
});

module.exports = router;