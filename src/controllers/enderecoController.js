const { endereco, cliente, empresa } = require('../models');

const enderecoController = {

    async adicionarOuAtualizarEndereco(req, res, next) {
        try {
            const { tipo_entidade, entidade_id } = req.params;

            if(tipo_entidade !== 'cliente' && tipo_entidade !== 'empresa') {
                return res.status(400).json({ error: 'Tipo de entidade inválido. Uso "cliente" ou "empresa".'});
            }

            let entidadeExistente;
            if(tipo_entidade === 'cliente') {
                entidadeExistente = await cliente.findByPk(entidade_id);
            } else {
                entidadeExistente = await empresa.findByPk(entidade_id);
            }

            if(!entidadeExistente) {
                return res.status(404).json({ error: `${tipo_entidade} não encontrado` });
            }

            const enderecoData = req.body;
            const { cidade, rua, numero, bairro, complemento, estado, cep } = enderecoData;

            let enderecoExistente =  await endereco.findOne({ where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id } });
            
            let enderecoAtualizado;
            
            if (enderecoExistente) {
                
                await endereco.update(enderecoData, { where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id } });
                
                enderecoAtualizado = await endereco.findOne({ where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id} });
            
            } else {

                enderecoAtualizado = await endereco.create({ ...enderecoData, tipo_entidade: tipo_entidade, entidade_id: entidade_id });
            }

            return res.status(200).json({ message: enderecoExistente ? 'Endereço atualizado com sucesso.' : 'Endereço adicionado com sucesso.', endereco: enderecoAtualizado });
        
        } catch (error) {
            next(error)
        }
    },

    async listarEndereco(req, res, next) {
        try {
            const {tipo_entidade, entidade_id} = req.params;

            if(tipo_entidade !== 'cliente' && tipo_entidade !== 'empresa') {
                return res.status(400).json({ error: 'Tipo de entidade inválido. Uso "cliente" ou "empresa".'});
            }

            let entidadeExistente;
            if(tipo_entidade === 'cliente') {
                entidadeExistente = await cliente.findByPk(entidade_id);
            } else {
                entidadeExistente = await empresa.findByPk(entidade_id);
            }

            if(!entidadeExistente) {
                return res.status(404).json({ error: `${tipo_entidade} não encontrado` });
            }    

            const enderecoEncontrado = await endereco.findOne({ where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id } });
            
            if(!enderecoEncontrado) {
                return res.status(404).json({ message: 'Endereço não cadastrado para esta entidade.' });
            }

            return res.status(200).json({ message: 'Endereço encontrado com sucesso.', endereco: enderecoEncontrado });

        } catch (error) {
            next(error);
        }
    },

    async removerEndereco(req, res, next) {
        try {
            const {tipo_entidade, entidade_id} = req.params;

            if(tipo_entidade !== 'cliente' && tipo_entidade !== 'empresa') {
                return res.status(400).json({ error: 'Tipo de entidade inválido. Uso "cliente" ou "empresa".'});
            }

            let entidadeExistente;
            if(tipo_entidade === 'cliente') {
                entidadeExistente = await cliente.findByPk(entidade_id);
            } else {
                entidadeExistente = await empresa.findByPk(entidade_id);
            }

            if(!entidadeExistente) {
                return res.status(404).json({ error: `${tipo_entidade} não encontrado` });
            }

            const enderecoExistente = await endereco.findOne({ where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id } });
            if (!enderecoExistente) {
                return res.status(404).json({ error: 'Endereço não encontrado.'});
            }

            await endereco.destroy({ where: { tipo_entidade: tipo_entidade, entidade_id: entidade_id } });
            return res.status(200).json({ message: 'Endereço removido com sucesso.'});
        
        } catch (error) {
           next(error);
        }
    }
};

module.exports = { enderecoController, models: { endereco, cliente, empresa } };
