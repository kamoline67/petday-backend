const { Op } = require('sequelize');
const { agendamento, agendamento_servico, porte_servico, cliente, pet, porte, servico, empresa, endereco } = require('../models');

const agendamentoController = {

    async criarAgendamento(req, res, next) {
        try {
            const { empresa_id } = req.params;
            
            const agendamentoData = req.body;
            const { cliente_id, pet_id, data_hora, endereco_atendimento, transporte, servicos} = agendamentoData;

            const clienteExistente = req.clienteExistente;

            const empresaExistente = req.empresaExistente;

            if (!servicos || !Array.isArray(servicos) || servicos.length === 0) {
                return res.status(400).json({ error: 'Lista serviços é obrigatória.' });
            }

            

            let enderecoAtendimento = null;

            if (transporte) {
                const enderecoCliente = await endereco.findOne({ where: { tipo_entidade: 'cliente', entidade_id: cliente_id } });

                if (!enderecoCliente) {
                    return res.status(400).json({ error: 'Cliente não possui endereço cadastrado. Cadastre um endereço antes de agendar com transporte.' });
                }
                enderecoAtendimento = this.formatarEndereco(enderecoCliente);
            
            } else {
                const enderecoEmpresa = await endereco.findOne({ where: {tipo_entidade: 'empresa', entidade_id: empresa_id} });
                
                if (!enderecoEmpresa) {
                    return res.status(400).json({ error: 'Empresa não possui endereço cadastrado. Cadastre um endereço para a empresa primeiro.' })
                }
                enderecoAtendimento = agendamentoController.formatarEndereco(enderecoEmpresa);
            }   

            const dataAgendamento = new Date(data_hora);
            if (isNaN(dataAgendamento.getTime())) {
                return res.status(400).json({ error: 'Data/hora inválida.' });
            }

            if (dataAgendamento <= new Date()) {
                return res.status(400).json({ error: 'A data do agendamento deve ser futura.' });
            }

            const petExistente = req.petExistente;

            if (petExistente.cliente_id !== parseInt(cliente_id)) {
                return res.status(400).json({ error: 'O pet não pertence a este cliente.' });
            }

            const novoAgendamento = await agendamento.create({...agendamentoData, endereco_atendimento: enderecoAtendimento, empresa_id: empresa_id, status:'Agendado'});
            
            let subtotalTotal = 0;
            for(const item of servicos) {
                const {servico_id, observacao} = item;
                
                if(isNaN(servico_id)) {
                    await agendamento.destroy({ where: { agendamento_id: novoAgendamento.agendamento_id} });
                    return res.status(400).json({ error: 'ID do servico deve ser um número válido.' });
                }

                const servicoExistente = await servico.findByPk(servico_id);
                
                if(!servicoExistente) {
                    await agendamento.destroy({ where: { agendamento_id: novoAgendamento.agendamento_id } });
                    return res.status(404).json({ error: `Serviço com ID ${servico_id} não encontrado.` });
                };

                const porte_id = petExistente.porte_id;

                const precoServico = await porte_servico.findOne({ where: { servico_id, porte_id } });

                if (!precoServico) {
                    await agendamento.destroy({ where: { agendamento_id: novoAgendamento.agendamento_id } });
                    return res.status(400).json({ error: `Preço não definido para o serviço com o porte do pet.` });
                }

                await agendamento_servico.create({
                    agendamento_id: novoAgendamento.agendamento_id,
                    servico_id,
                    porte_id,
                    preco_unitario: precoServico.preco_porte,
                    subtotal: precoServico.preco_porte,
                    observacao: observacao || null
                });

                subtotalTotal += parseFloat(precoServico.preco_porte);
            }

            const agendamentoCompleto = await agendamento.findByPk(novoAgendamento.agendamento_id, {
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: pet, attributes: ['nome', 'especie'] },
                    { model: servico, as: 'servicos', through: {attributes: ['preco_unitario', 'subtotal', 'observacao'] }}
                ]
            });

            return res.status(201).json({ message: 'Agendamento criado com sucesso.', agendamento: agendamentoCompleto, total: subtotalTotal });
        } catch (error) {
            next(error);
        }
    },

    formatarEndereco(enderecoObj) {
        const {  cidade, rua, numero, bairro, complemento, estado, cep } = enderecoObj;

        let enderecoFormatado = `${rua}, ${numero}, ${bairro}, ${cidade} - ${estado}, ${cep}`;
        if (complemento) {
            enderecoFormatado += `( ${complemento} )`;
        }
        return enderecoFormatado;
    },

    async listarAgendamentos(req, res, next) {
        try{
            const { status, data_inicio, data_fim } = req.query;

            let whereClause = {};

            if (status) {
                const statusPermitidos = ['Agendado', 'Confirmado', 'Em Andamento', 'Finalizado', 'Cancelado'];
                if (!statusPermitidos.includes(status)) {
                    return res.status(400).json({ error: 'Status inválido.' });
                }
                whereClause.status = status;
            }

            if (data_inicio && data_fim) {
                const inicio = new Date(data_inicio);
                const fim = new Date(data_fim);

                if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) ) {
                    return res.status(400).json({ error: 'Datas inválidas.' });
                }

                whereClause.data_hora = {
                    [Op.between]: [inicio, fim]
                };
            }

            const agendamentos = await agendamento.findAll({
                where: whereClause,
                include: [
                    {model: cliente, attributes: ['nome', 'telefone']},
                    {model: pet, attributes: ['nome', 'especie']},
                    {model: servico, as: 'servicos', through: { attributes: ['preco_unitario']}}
                ],
                order: [['data_hora', 'ASC']]
            });
            
            return res.status(200).json({ message: 'Agendementos encontrados com sucesso.', quantidade: agendamentos.length, agendamentos: agendamentos });
        
        } catch (error) {
            next(error);
        }
    },

    async buscarAgendamentoPorId(req, res, next) {
        try {
            const { id } = req.params;

            const agendamentoEncontrado = req.agendamentoExistente;

            return res.status(200).json({ message: 'Agendamento encontrado com sucesso.', agendamento: agendamentoEncontrado });

        } catch (error) {
            next(error);
        }
    },

    async listarAgendamentosPorCliente(req, res, next) {
        try {
            const {clienteId} = req.params;

            const clienteExistente = req.clienteExistente;

            const agendamentos = await agendamento.findAll({ where: { cliente_id: clienteId },
                include: [
                        { model: pet, attributes: ['nome', 'especie'] },
                        { model: servico, as: 'servicos', through: { attributes: ['preco_unitario'] } }
                    ],
                    order: [['data_hora', 'ASC']]
                });

            return res.status(200).json({ message: 'Agendamentos encontrados com sucesso.', quantidade: agendamentos.length, agendamento: agendamentos });

        } catch (error) {
            next(error);
        }
    },

    async atualizarStatusAgendamento(req, res, next) {
        try {
            const {id} = req.params;
            const {status} = req.body;

            const agendamentoExistente = req.agendamentoExistente;

            const statusPermitidos = ['Agendado', 'Confirmado', 'Em Andamento', 'Finalizado', 'Cancelado'];
            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({ error: 'Status inválido.' });
            }

            await agendamento.update({ status}, { where: {agendamento_id: id} });
            
            const agendamentoAtualizado = await agendamento.findByPk(id);

            return res.status(200).json({ message: (`Agendamento ${status.toLowerCase()} com sucesso.`), agendamento: agendamentoAtualizado });

        } catch (error) {
            next(error);
        }
    },

    async removerAgendamento(req, res, next) {
        try {
            const {id} = req.params;

            const agendamentoExistente = req.agendamentoExistente;

            if (agendamentoExistente.status === 'Finalizado') {
                return res.status(400).json({ error: 'Não é possível remover um agendamento finalizado.' });
            }

            await agendamento_servico.destroy({ where: { agendamento_id: id} });

            await agendamento.destroy({ where: { agendamento_id: id } });

            return res.status(200).json({ message: 'Agendamento removido com sucesso.', agendamento_removido: { id: agendamentoExistente.agendamento_id, data_hora: agendamentoExistente.data_hora } });

        } catch (error) {
            next(error)
        }
    },

    async listarAgendamentosPorEmpresa(req, res, next) {
        try {
            const { empresaId } = req.params;
    
            const agendamentos = await agendamento.findAll({ 
                where: { empresa_id: empresaId },
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: pet, attributes: ['nome', 'especie'] },
                    { model: servico, as: 'servicos', through: { attributes: ['preco_unitario'] } }
                ],
                order: [['data_hora', 'ASC']]
            });
    
            return res.status(200).json({ message: 'Agendamentos da empresa encontrados com sucesso.', quantidade: agendamentos.length, agendamentos: agendamentos });

        } catch (error) {
            next(error);
        }
    },
    
    async atualizarDataAgendamento(req, res, next) {
        try {
            const { id } = req.params;
            const { data_hora } = req.body;
    
            const agendamentoExistente = req.agendamentoExistente;
    
            if (!data_hora) {
                return res.status(400).json({ error: 'Nova data/hora é obrigatória.' });
            }
    
            const novaData = new Date(data_hora);
            if (isNaN(novaData.getTime())) {
                return res.status(400).json({ error: 'Data/hora inválida.' });
            }
    
            if (novaData <= new Date()) {
                return res.status(400).json({ error: 'A nova data do agendamento deve ser futura.' });
            }
    
            const conflito = await agendamento.findOne({
                where: {
                    empresa_id: agendamentoExistente.empresa_id,
                    data_hora: novaData,
                    agendamento_id: { [Op.ne]: id },
                    status: { [Op.in]: ['Agendado', 'Confirmado'] }
                }
            });
    
            if (conflito) {
                return res.status(400).json({ error: 'Já existe um agendamento para este horário.' });
            }
    
            await agendamento.update({ data_hora: novaData }, { where: { agendamento_id: id } });
    
            const agendamentoAtualizado = await agendamento.findByPk(id, {
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: pet, attributes: ['nome', 'especie'] },
                    { model: servico, as: 'servicos', through: { attributes: ['preco_unitario'] } }
                ]
            });
    
            return res.status(200).json({ message: 'Data do agendamento atualizada com sucesso.', agendamento: agendamentoAtualizado });
    
        } catch (error) {
            next(error);
        }
    },
    
    async adicionarServicoAgendamento(req, res, next) {
        try {
            const { id } = req.params;
            const { servico_id, observacao } = req.body;
    
            const agendamentoExistente = req.agendamentoExistente;
    
            if (agendamentoExistente.status === 'Finalizado' || agendamentoExistente.status === 'Cancelado') {
                return res.status(400).json({ error: 'Não é possível adicionar serviços a um agendamento finalizado ou cancelado.' });
            }
    
            const servicoExistente = await servico.findByPk(servico_id);
            if (!servicoExistente) {
                return res.status(404).json({ error: 'Serviço não encontrado.' });
            }
    
            const servicoExistenteNoAgendamento = await agendamento_servico.findOne({ where: { agendamento_id: id, servico_id }});
    
            if (servicoExistenteNoAgendamento) {
                return res.status(400).json({ error: 'Serviço já está incluído neste agendamento.' });
            }
    
            const petDoAgendamento = await pet.findByPk(agendamentoExistente.pet_id);
            const precoServico = await porte_servico.findOne({ where: { servico_id, porte_id: petDoAgendamento.porte_id } });
    
            if (!precoServico) {
                return res.status(400).json({ error: 'Preço não definido para este serviço com o porte do pet.' });
            }
    
            await agendamento_servico.create({
                agendamento_id: id,
                servico_id,
                porte_id: petDoAgendamento.porte_id,
                preco_unitario: precoServico.preco_porte,
                subtotal: precoServico.preco_porte,
                observacao: observacao || null
            });
    
            const agendamentoAtualizado = await agendamento.findByPk(id, {
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: pet, attributes: ['nome', 'especie'] },
                    { model: servico, as: 'servicos', through: { attributes: ['preco_unitario', 'subtotal', 'observacao'] } }
                ]
            });
    
            return res.status(200).json({ message: 'Serviço adicionado ao agendamento com sucesso.', agendamento: agendamentoAtualizado });
    
        } catch (error) {
            next(error);
        }
    },
    
    async removerServicoAgendamento(req, res, next) {
        try {
            const { id, servicoId } = req.params;
    
            const agendamentoExistente = req.agendamentoExistente;
    
            if (agendamentoExistente.status === 'Finalizado' || agendamentoExistente.status === 'Cancelado') {
                return res.status(400).json({ error: 'Não é possível remover serviços de um agendamento finalizado ou cancelado.' });
            }
    
            const servicoNoAgendamento = await agendamento_servico.findOne({ where: { agendamento_id: id, servico_id: servicoId } });
    
            if (!servicoNoAgendamento) {
                return res.status(404).json({ error: 'Serviço não encontrado neste agendamento.' });
            }
    
            await agendamento_servico.destroy({ where: { agendamento_id: id, servico_id: servicoId } });
    
            const agendamentoAtualizado = await agendamento.findByPk(id, {
                include: [
                    { model: cliente, attributes: ['nome', 'telefone'] },
                    { model: pet, attributes: ['nome', 'especie'] },
                    { model: servico, as: 'servicos', through: { attributes: ['preco_unitario', 'subtotal', 'observacao'] } }
                ]
            });
    
            return res.status(200).json({ message: 'Serviço removido do agendamento com sucesso.', agendamento: agendamentoAtualizado });

    } catch (error) {
        next(error);
    }
}
};

module.exports = { agendamentoController, models: { agendamento, agendamento_servico, porte_servico, cliente, pet, porte, servico, empresa, endereco } };
