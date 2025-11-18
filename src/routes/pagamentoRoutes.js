const express = require('express');
const router = express.Router();

const { pagamentoController, models } = require('../controllers/pagamentoController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/',
    validarCamposObrigatorios([ 'agendamento_id', 'forma_pagamento', 'valor' ]),
    validarExistencia(models.agendamento, 'agendamento_id', 'Agendamento', 'body' ),
    pagamentoController.criarPagamento
);

router.get('/',
    pagamentoController.listarPagamentos
);

router.get('/:id',
    pagamentoController.buscarPagamentoPorId
);

router.put('/:id',
    validarExistencia(models.pagamento, 'id', 'Pagamento'),
    pagamentoController.atualizarStatusPagamento
);

module.exports = router;
