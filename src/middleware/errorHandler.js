const errorHandler = (error, req, res, next) => {
     console.error('Erro capturado:', { timestamp: new Date().toISOString(), message: error.message, name: error.name, url: req.url, method: req.method });

     if (process.env.NODE_ENV === 'development') {
          console.error('Stack trace:', error.stack);
     }

     if (error instanceof TypeError) {
          return res.status(400).json({ error: 'Erro de tipo.', message: 'Ocorreu um erro no de tipo.' });
     }

     //Erros Sequelize
     if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(err => ({ campo: err.path, mensagem: err.message}));
          return res.status(400).json({ error: 'Erro de validação. ', detalhes: errors });
     }

     if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).json({ error: 'Dados duplicados.', message: 'Dados já em uso.' });
     }

     if (error.name === 'SequelizeDatabaseError') {
          return res.status(400).json({ error: 'Erro de banco de dados.', message: 'Operação inválida no banco de dados.' });
     }

     if (error.name === 'SequelizeConnectionError') {
          return res.status(400).json({ error: 'Erro ao conectar banco de dados.', message: 'Operação inválida por falta de conexão com o banco de dados.' });
     }

     //Erros JWT
     if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Token inválido.' });
     }

     if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expirado.' });
     }

     //Erro por statuscode
     if (error.statusCode) {
          return res.status(error.statusCode).json({ error: error.message });
     }

     if (error.status === 404) {
          return res.status(404).json({ error: 'Recurso não encontrado.' });
     }

     res.status(500).json({ error: 'Erro interno do servidor.', ...(process.env.NODE_ENV === 'development' && { stack: error.stack, detalhes: error.message }) });
};

module.exports = errorHandler;
