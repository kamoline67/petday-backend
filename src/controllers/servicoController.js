const { servico, empresa, porte_servico, porte } = require('../models');

const servicoController = {

    async criarServico(req, res, next) {
        try {
            const { empresa_id, tipo, descricao, duracao_min, precosPortes } = req.body;

            const empresaExistente = req.empresaExistente;

            const novoServico = await servico.create({ empresa_id, tipo, descricao, duracao_min, ativo: true });

            if (precosPortes && Array.isArray(precosPortes)) {
                const precos = precosPortes.map(preco => ({
                    servico_id: novoServico.servico_id,
                    porte_id: preco.porte_id,
                    preco_porte: preco.preco_porte
                }));

                await porte_servico.bulkCreate(precos);
            }

            const servicoCompleto = await servico.findByPk(novoServico.servico_id, {
                include: [
                    {
                        model: porte,
                        as: 'portes',
                        through: { attributes: ['preco_porte'] }
                    },
                    { model: empresa }
                ]
            });

            return res.status(201).json({ message: 'Servico criado com sucesso.', servico: servicoCompleto });

        } catch (error) {
            next(error);
        }
    },

    async listarServicos(req, res, next) {
        try{
            const { empresa_id } = req.query;

            const where = { ativo: true };
            if (empresa_id) where.empresa_id = empresa_id;

            const servicos = await servico.findAll ({
                where,
                include: [
                    {
                        model: porte,
                        as: 'portes',
                        through: { attributes: ['preco_porte'] }
                    },
                    {model: empresa}
                ],
                order: [['tipo', 'ASC']]
            });

            return res.status(200).json({ message: 'Servicos encontrados com sucesso.', quantidade: servicos.length, servicos: servicos });
        
        } catch (error) {
            next(error);
        }
    },

    async buscarServicoPorId(req, res, next) {
        try {
            const {id} = req.params;

            const servicoEncontrado = await servico.findByPk(id, {
                include: [
                    {
                        model: porte,
                        as: 'portes',
                        through: { attributes: ['preco_porte'] }
                    },
                    {model: empresa}
                ]
            });

            if (!servicoEncontrado) {
                return res.status(400).json({ error: 'Servico não encontrado.' });
            }

            return res.status(200).json({ message: 'Servico encontrado com sucesso.', servico: servicoEncontrado });

        } catch (error) {
            next(error);
        }
    },

    async atualizarServico(req, res, next) {
        try{
            const {id} = req.params;
            const { tipo, descricao, duracao_min, ativo } = req.body;

            const servicoExistente = req.servicoExistente;

            const dadosAtualizacao = {};

            if (tipo) dadosAtualizacao.tipo = tipo;
            if (descricao) dadosAtualizacao.descricao = descricao;
            if (duracao_min) dadosAtualizacao.duracao_min = duracao_min;
            if (typeof ativo === 'boolean') dadosAtualizacao.ativo = ativo;

            if (Object.keys(dadosAtualizacao).lenght === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }

            await servico.update(dadosAtualizacao, { where: { servico_id: id }});

            const servicoAtualizado = await servico.findByPk(id, {
                include: [
                    {
                        model: porte,
                        as: 'portes',
                        through: { attributes: ['preco_porte'] }
                    },
                    {model: empresa}
                ]
            });

            return res.status(200).json({ message: 'Servico atualizado com sucesso.', servico: servicoAtualizado });

        } catch (error) {
            next(error);
        }
    },

    async desativarServico(req, res, next) {
        try {
            const {id} = req.params;

            const servicoExistente = req.servicoExistente;

            await servico.update({ ativo: false }, { where: { servico_id: id } });

            return res.status(200).json({
                message: 'Servico desativado com sucesso.',
                servico: {
                    id: servicoExistente.servico_id,
                    tipo: servicoExistente.tipo,
                    ativo: false
                } 
            });

        } catch (error) {
            next(error);
        }
    },

    async removerServico(req, res, next) {
        try{
            const {id} = req.params;

            const servicoExistente = req.servicoExistente;

            await servico.destroy({ ativo: false }, { where: { servico_id: id } });

            return res.status(200).json({
                message: 'Servico excluido com sucesso.',
                servico: {
                    id: servicoExistente.servico_id,
                    tipo: servicoExistente.tipo,
                    ativo: false
                } 
            });
        
        } catch (error) {
            next(error)
        }
    }
};

module.exports = { servicoController, models: { servico, empresa, porte_servico, porte} };