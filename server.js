const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const apiRoutes = require('./src/routes/apiRoutes');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});