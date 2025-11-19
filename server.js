const express = require('express');
const app = require('./src/app');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

app.use(helmet());
app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
        res.json({ status: 'OK', message: 'Backend funcionando.' });
});

app.get('/api/test', (req, res) => {
        res.json({ message: 'API funcionando.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend rodando: http://localhost:${PORT}`);
});