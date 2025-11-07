const express = require('express');
const router = express.Router();

const { agendamentoController, models } = require('../controllers/agendamentoController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/', 
    validarCamposObrigatorios([ 'cliente_id', 'pet_id', 'data_hora', 'endereco_atendimento', 'transporte', 'servicos']),
    validarExistencia(models.cliente, 'cliente_id', 'Cliente', 'body'),
    validarExistencia(models.pet, 'pet_id', 'Pet', 'body'),
    agendamentoController.criarAgendamento
);

router.get('/', agendamentoController.listarAgendamentos);

router.get('/:id', 
        validarExistencia(
            models.agendamento,
            'agendamento_id',
            'Agendamento', 
            'body',
            includes = [
                { model: cliente, attributes: ['nome', 'telefone', 'email'] },
                { model: pet, attributes: ['nome', 'especie', 'raca'] },
                { 
                    model: servico, 
                    as: 'servicos',
                    through: { 
                        attributes: ['preco_unitario', 'subtotal', 'observacao'],
                        include: [{ model: porte, attributes: ['descricao'] }]
                    }
                }
            ]
        ),
        agendamentoController.buscarAgendamentoPorId
);

router.get('/:id', 
        validarExistencia(
            models.cliente,
            'cliente_id',
            'Cliente', 
            'body',
            includes = [
                { model: pet, attributes: ['nome', 'especie'] },
                { 
                    model: servico, 
                    as: 'servicos',
                    through: { 
                        attributes: ['preco_unitario']
                    }
                }
            ],
            order = [['data_hora', 'DESC']]
        ),
        agendamentoController.listarAgendamentosPorCliente
);

router.put('/:id', validarExistencia(models.agendamento, 'agendamento_id', 'Agendamento', 'body'), agendamentoController.atualizarStatusAgendamento);
router.delete('/:id', validarExistencia(model.agendamento, 'agendamento_id', 'Agendamento', 'body'), agendamentoController.removerAgendamento);
