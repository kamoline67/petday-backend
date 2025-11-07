const { empresa, servico } = require('../models');

const empresaController = {

    async criarEmpresa(req, res, next) {
        try {
            const { nome, telefone } = req.body;

            const novaEmpresa = await empresa.create({ nome, telefone });

            return res.status(201).json({ message: 'Empresa cadastrada com sucesso.', empresa: novaEmpresa });
        
        } catch (error) {
            next(error);
        }
    },

    async listarEmpresas(req, res, next) {
        try {
            const empresas = await empresa.findAll({
                include: [
                    {
                        model: servico,
                        as: 'servicos',
                        where: { ativo: true },
                        required: false
                    }
                ],
                order: [['nome', 'ASC']]
            });

            return res.status(200).json({ 
                message: 'Empresas encontradas com sucesso.', 
                quantidade: empresas.length, 
                empresas: empresas 
            });
        
        } catch (error) {
            next(error);
        }
    },

    async buscarEmpresaPorId(req, res, next) {
        try {
            const { id } = req.params;

            const empresaEncontrada = await empresa.findByPk(id, {
                include: [
                    {
                        model: servico,
                        as: 'servicos',
                        where: { ativo: true },
                        required: false
                    }
                ]
            });

            if (!empresaEncontrada) {
                return res.status(404).json({ error: 'Empresa não encontrada.' });
            }

            return res.status(200).json({ 
                message: 'Empresa encontrada com sucesso.', 
                empresa: empresaEncontrada 
            });
        
        } catch (error) {
            next(error);
        }
    },

    async atualizarEmpresa(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, telefone } = req.body;

            const empresaExistente = req.empresaExistente;

            const dadosAtualizacao = {};

            if (nome) dadosAtualizacao.nome = nome;
            if (telefone) dadosAtualizacao.telefone = telefone;

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }

            await empresa.update(dadosAtualizacao, { 
                where: { empresa_id: id } 
            });

            const empresaAtualizada = await empresa.findByPk(id, {
                include: [
                    {
                        model: servico,
                        as: 'servicos',
                        where: { ativo: true },
                        required: false
                    }
                ]
            });

            return res.status(200).json({ 
                message: 'Empresa atualizada com sucesso.', 
                empresa: empresaAtualizada 
            });
        
        } catch (error) {
            next(error);
        }
    },

    async removerEmpresa(req, res, next) {
        try {
            const { id } = req.params;

            const empresaExistente = req.empresaExistente;

            // Verificar se existem serviços ativos
            const servicosAtivos = await servico.count({ 
                where: { 
                    empresa_id: id,
                    ativo: true 
                } 
            });

            if (servicosAtivos > 0) {
                return res.status(400).json({ 
                    error: 'Não é possível remover empresa com serviços ativos. Desative os serviços primeiro.' 
                });
            }

            await empresa.destroy({ where: { empresa_id: id } });

            return res.status(200).json({
                message: 'Empresa removida com sucesso',
                empresa_removida: {
                    id: empresaExistente.empresa_id,
                    nome: empresaExistente.nome
                }
            });
        
        } catch (error) {
            next(error);
        }
    }
};

module.exports = { empresaController };
