const express = require('express');
const app = express();                         // utilização do express
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin"}
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Rotas

app.use('api/auth', require('./routes/authRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/servicos', require('./routes/servicoRoutes'));
app.use('/api/portes', require('./routes/porteRoutes'));
app.use('/api/porte-servico', require('./routes/porteServicoRoutes'));
app.use('/api/agendamentos', require('./routes/agendamentoRoutes'));
app.use('/api/pagamentos', require('./routes/pagamentoRoutes'));
app.use('/api/enderecos', require('./routes/enderecoRoutes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.get('/health', (req, res) => {
    res.status(200).json({ stautus: 'OK', message: 'Sistema funcionando.' });
});

const swaggerSetup = require('./config/swagger');
swaggerSetup(app);

module.exports = app;