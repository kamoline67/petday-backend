const express = require('express');
const router = express.Router();

const { empresaController, models } = require('../controllers/empresaController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/',
    validarCamposObrigatorios(['nome', 'telefone']),
    empresaController.criarEmpresa
);

router.get('/',
    empresaController.listarEmpresas
);

router.get('/:id',
    validarExistencia(models.empresa, 'id', 'Empresa'),
    empresaController.buscarEmpresaPorId
);

router.put('/:id',
    validarExistencia(models.empresa, 'id', 'Empresa'),
    empresaController.atualizarEmpresa
);

router.delete('/:id',
    validarExistencia(models.empresa, 'id', 'Empresa'),
    empresaController.removerEmpresa
);

module.exports = router;