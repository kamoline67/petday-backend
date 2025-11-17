const { pagamento, agendamento, cliente } = require('../models');

const pagamentoController = {

    async criarPagamento(req, res, next) {
        try {
            const { agendamento_id, forma_pagamento, valor } = req.body;

            const agendamentoExistente = req.agendamentoExistente;

            const pagamentoExistente = await pagamento.findOne({ where: { agendamento_id } });

            if (pagamentoExistente) {
                return res.status(400).json({ error: 'Já existe um pagamento para este agendamento.' });
            }

            const novoPagamento = await pagamento.create({
                agendamento_id,
                cliente_id: agendamentoExistente.cliente_id,
                forma_pagamento,
                valor,
                status: 'Pendente'
            });

            return res.status(201).json({ message: 'Pagemento criado com sucesso.', pagamento: novoPagamento });
            
        } catch (error) {
            next(error);
        }
    },

    async listarPagamentos(req, res, next) {
        try{
            const { cliente_id, status } = req.query;

            const where = {};
            if (cliente_id) where.cliente_id = cliente_id;
            if (status) where.status = status;

            const pagamentos = await pagamento.findAll({
                where,
                include: [
                    { model: agendamento },
                    { model: cliente, attributes: { exclude: ['senha'] }}
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({ message: 'Pagamentos encontrados com sucesso.', quantidade: pagemento.length, pagamentos: pagamentos });

        } catch (error) {
            next(error);
        }
    },

    async buscarPagamentoPorId(req, res, next) {
        try{
            const { id } = req.params;
            
            const pagamentoEncontrado = await pagamento.findByPk(id, {
                include: [
                    { model: agendamento },
                    { model: cliente, attributes: { exclude: ['senha'] }}
                ]
            });

            if (!pagamentoEncontrado) {
                return res.status(400).json({ error: 'Pagamento não encontrado.' });
            }

            return res.status(200).json({ message: 'Pagamento encontrado com sucesso.', pagamento: pagamentoEncontrado });

        } catch (error) {
            next(error);
        }
    },
    
    async atualizarStatusPagamento(req, res, next) {
        try{
            const { id } = req.params;
            const { status } = req.body;

            pagamentoExistente = req.pagamentoExistente;

            if(!['Pendente', 'Pago'].include(status)) {
                return res.status(400).json({ error: 'Status inválido. Use "Pendente" ou "Pago".' });
            }

            await pagamento.update({ status }, {where: { pagamento_id: id }});

            const pagamentoAtualizado = await pagamento.findByPk(id, {
                include: [
                    { model: agendamento },
                    { model: cliente, attributes: { exclude: ['senha'] }}
                ]
            });

            return res.status(200).json({ message: 'Status do pagamento atualizado com sucesso.', pagamento: pagamentoAtualizado });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = { pagamentoController, models: { pagamento, agendamento, cliente }};