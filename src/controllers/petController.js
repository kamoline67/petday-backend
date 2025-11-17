const { pet, cliente, porte, agendamento } = require('../models');

const petController = {

    async criarPet(req, res, next) {
        try {
            const { cliente_id, nome, especie, raca, idade, sexo, porte_id } = req.body;

            const clienteExistente = req.clienteExistente

            const novoPet = await pet.create({ cliente_id, nome, especie, raca, idade, sexo, porte_id});

            const petCompleto = await pet.findByPk(novoPet.pet_id, {
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: porte, attributes: ['descricao']}
                ]
            });

            return res.status(201).json({ message: 'Pet cadastrado com sucesso.', pet: petCompleto });
        
        } catch (error) {
            next(error);
        }
    },

    async listarPets(req, res, next) {
        try{
            const pets = await pet.findAll({
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: porte, attributes: ['descricao'] }
                ],
                order: [['nome', 'ASC']]
            });

            return res.status(200).json({ message: 'Pets encontrados com sucesso.', quantidade: pets.length, pets: pets });
        
        } catch (error) {
            next(error);
        }
    },

    async buscarPetPorId(req, res, next) {
        try {
            const petEncontrado = req.petExistente;
            return res.status(200).json({ message: 'Pet encontrado com sucesso.', pet: petEncontrado });
        
        } catch (error){
            next(error)
        }
    },

    async atualizarPet(req, res, next) {
        try {
            const {id} = req.params;

            const { nome, especie, raca, idade, sexo, porte_id} = req.body

            const petExistente = req.petExistente;

            const dadosAtualizacao = {};
            
            if(nome) dadosAtualizacao.nome = nome;
            if(especie) dadosAtualizacao.especie = especie;
            if(raca) dadosAtualizacao.raca = raca;
            if(idade) dadosAtualizacao.idade = idade;
            if(sexo) dadosAtualizacao.sexo = sexo;
            if(porte_id) dadosAtualizacao.porte_id = porte_id;

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }

            await pet.update(dadosAtualizacao, { where: { pet_id: id } });

            const petAtualizado = await pet.findByPk(id, {
                include: [
                            { model: cliente, attributes: ['nome', 'telefone', 'email'] },
                            { model: porte, attributes: ['descricao'] }
                        ]
            });

            return res.status(200).json ({ message: 'Pet atualizado com sucesso.', pet: petAtualizado });
        
        } catch (error) {
            next(error);
        }
    },
    
    async listarPetPorCliente(req, res, next) {
        try {
            const { clienteId } = req.params;

            const pets = await pet.findAll({ where: { cliente_id: clienteId }, include: [{model: porte, attributes: ['descricao'] }], order: [['nome', 'ASC']] });
            
            return res.status(200).json({ message: 'Pet do cliente encontrados com sucesso.', quantidade: pets.length, pets: pets });
        } catch (error) {
            next(error);
        }
    },

    async removerPet(req, res, next) {
        try{
            const {id} = req.params;

            const petExistente = req.petExistente;

            const agendamentosAtivos = await agendamento.count({ where: { pet_id: id, status: { [require('sequelize').Op.notIn]: ['Finalizado', 'Cancelado'] }} });
            if (agendamentosAtivos > 0) {
                return res.status(400).json({ error: 'Não é possível remover pet com agendamento ativos. Cancele os agendamentos primeiro.'});
            }
            await pet.destroy ({ where: { pet_id: id } });

            return res.status(200).json({ message: 'Pet removido com sucesso.', pet_removido: { id: petExistente.pet_id, nome: petExistente.nome} });
        
        } catch (error) {
            next(error);
        }
    }
};

module.exports = { petController, models: { cliente, pet, porte } };
