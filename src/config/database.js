const { Sequelize } = require('sequelize');

const conexao = new Sequelize(
  process.env.DB_NAME || 'petday',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '1234',
  {
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    retry: {
      max: 10,
      timeout: 30000
    }
  }
);

conexao.authenticate()
  .then(() => {
    console.log('Banco de dados inicializado.');
  })
  .catch(err => {
    console.error('Erro ao conectar com MySQL.', err);
  });

module.exports = conexao;
