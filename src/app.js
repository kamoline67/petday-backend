const express = require('express');
const app = express();                         // utilização do express

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Rotas

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

module.exports = app;