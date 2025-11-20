const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { cliente } = require('../models');

const authController = {

    async login(req, res, next) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            }

            const clienteExistente = await cliente.findOne({ where: { email }, attributes: ['cliente_id', 'nome', 'senha', 'telefone']});

            if (!clienteExistente) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const senhaValida = await bcrypt.compare(senha, clienteExistente.senha);
            if(!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const token = jwt.sign(
                {
                clienteId: clienteExistente.cliente_id,
                email: clienteExistente.email,
                nome: clienteExistente.nome
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            const clienteSeguro = {
                cliente_id: clienteExistente.cliente_id,
                nome: clienteExistente.nome,
                email: clienteExistente.email,
                telefone: clienteExistente.telefone
            };

            return res.status(200).json({ message: 'Login realizado com sucesso.', token, cliente: clienteSeguro, expiraEm: process.env.JWT_EXPIRES_IN || '7d' });
        } catch (error) {
            next(error);
        }
    },

    async perfil(req, res, next) {
        try {
            const clienteId = req.clienteId;

            const clientePerfil = await cliente.findByPk(clienteId, {
                attributes: {exclude: ['senha'] },
                include: [
                    {
                        model: require('./pet').pet,
                        attributes: ['pet_id', 'nome', 'especie', 'raca'],
                        required: false
                    },
                    {
                        model: require('./endereco').endereco,
                        as: 'endereco',
                        required: false
                    }
                ]
            });

            if(!clientePerfil) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            return res.status(200).json({ message: 'Perfil recuperado com sucesso.', cliente: clientePerfil });
        } catch (error) {
            next(error);
        }
    },

    async atualizarPerfil(req, res, next) {
        try {
            const clienteId = req.clienteId;
            const { nome, telefone } = req.body;

            const dadosAtualizacao = {};
            if (nome) dadosAtualizacao.nome = nome;
            if (telefone) dadosAtualizacao.telefone = telefone;

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }

            await cliente.update(dadosAtualizacao, { where: { cliente_id: clienteId } });

            const clienteAtualizado = await cliente.findByPk(clienteId, { attributes: { exclude: ['senha'] } });

            return res.status(200).json({ message: 'Perfil atualizado com sucesso.', cliente: clienteAtualizado });
        } catch(error) {
            next(error);
        }
    }
};

module.exports = { authController };