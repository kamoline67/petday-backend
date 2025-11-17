const express = require('express');
const router = express.Router();

const { porteController, models } = require('../controllers/porteController');
const validarExistencia = require('../middleware/validarExistencia');

router.get('/', validarCamposObrigatorios(['porte_id']), porteController.listarPortes);
router.get('/:id', validarCamposObrigatorios(['porte_id']),validarExistencia(models.porte, 'id', 'Porte'), porteController.buscarPortePorId);

module.exports = router;