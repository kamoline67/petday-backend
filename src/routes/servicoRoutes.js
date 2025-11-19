const express = require('express');
const router = express.Router();

const { servicoController, models } = require('../controllers/servicoController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/', 
            validarCamposObrigatorios(['empresa_id', 'tipo', 'descricao', 'duracao_min', 'precosPortes']),
            validarExistencia(models.empresa, 'empresa_id', 'Empresa', 'body'),
            servicoController.criarServico
);

router.get('/',
    servicoController.listarServicos
);

router.get('/:id',
    validarExistencia(models.servico, 'id', 'Servico'),
    servicoController.buscarServicoPorId
);

router.put('/:id',
    validarExistencia(models.servico, 'id', 'Servico'),
    servicoController.atualizarServico
);

router.put('/:id',
    validarExistencia(models.servico, 'id', 'Servico'),
    servicoController.desativarServico
);

router.delete('/:id',
    validarExistencia(models.servico, 'id', 'Servico'),
    servicoController.removerServico
);

module.exports = router;

