const express = require('express');
const router = express.Router();

const { porteServicoController, models } = require('../controllers/porteServicoController');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.put('/:servico_id/:porte_id', validarCamposObrigatorios([ 'servico_id', 'porte_id', 'preco_porte' ]), porteServicoController.atualizarPreco);
router.get('/servico_id', porteServicoController.listarPrecoPorServico);

module.exports = router;