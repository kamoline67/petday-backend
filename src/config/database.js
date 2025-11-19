const { Sequelize } = require('sequelize');

const conexao = new Sequelize('dbpetday', 'root', 'escola', {
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

module.exports = conexao;
