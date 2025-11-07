
const { Sequelize } = require('sequelize');

const conexao = new Sequelize('dbpetday', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});

conexao.authenticate()
  .then(() => {
    console.log('Banco de dados inicializado.');
  })
  .catch(err => {
    console.error('Erro ao conectar com MySQL.', err);
  });

module.exports = conexao; // exporta a instância do Sequelize
