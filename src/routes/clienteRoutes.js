const express = require('express');
const router = express.Router();

const { clienteController, models } = require('../controllers/clienteController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/', 
    validarCamposObrigatorios([ 'nome' , 'telefone', 'email', 'senha' ]),
    clienteController.criarCliente
);

router.get('/', clienteController.listarClientes);
router.get('/:id', validarExistencia(models.cliente, 'id', 'Cliente'), clienteController.buscarClienteId);
router.put('/:id', validarExistencia(models.cliente, 'id', 'Cliente'), clienteController.atualizarCliente);
router.delete('/:id', validarExistencia(models.cliente, 'id', 'Cliente'), clienteController.removerCliente);

module.exports = router;