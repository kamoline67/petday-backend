const express = require('express');
const app = express();                         // utilização do express
require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//rotas
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/clientes', require('./routes/enderecoRoutes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;