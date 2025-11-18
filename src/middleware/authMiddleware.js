const jwt = require('jsonwebtoken');
const { cliente } = require('../models');

const authMiddleware = {
    verificarToken: (req, res, next) => {
        try{
            const authHeader = req.header('Authorization');

            if(!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(400).json({ error: 'Acesso negado. Token não fornecido.' });
            }

            const token = authHeader.replace('Bearer ', '' );

            if(!token) {
                return res.status(400).json({ error: 'Acesso negado. Token não fornecido.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.clienteId = decoded.clienteId;
            req.clienteEmail = decoded.email;
            next();

        } catch(error) {
           next(error);
        }
    },

    tokenOpcional: (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.clienteId = decoded.clienteId;
                req.clienteEmail = decoded.email;
            }
            next();

        } catch (error) {
            next();
        }
    },

    verificarPropriedade: (Model, idParam = 'id', ownerField = 'cliente_id') => {
        return async (req, res, next) => {
            try {
                const resourceId = req.params[idParam];
                const clienteId = req.clienteId;

                const recurso = await Model.findByPk(resourceId);

                if (!recurso) {
                    return res.status(404).json({ error: 'Recurso não encontrado.' });
                }

                if (recurso[ownerField] !== clienteId) {
                    return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para acessar esse recurso.' });
                }

                req[`${Model.name.toLowerCase()}Existente`] = recurso;
                next();

            } catch (error) {
                console.error('Erro ao verificar propriedades:', error);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }
};

module.exports = authMiddleware;