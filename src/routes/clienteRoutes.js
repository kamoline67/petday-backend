const express = require('express');
const router = express.Router();

const { clienteController, models } = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/', 
    validarCamposObrigatorios([ 'nome' , 'telefone', 'email', 'senha' ]),
    clienteController.criarCliente
);

router.get('/',
    authMiddleware.verificarToken,
    clienteController.listarClientes
);

router.get('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.cliente, 'id', 'Cliente'),
    authMiddleware.verificarPropriedade(models.cliente, 'id'),
    clienteController.buscarClienteId
);

router.put('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.cliente, 'id', 'Cliente'),
    authMiddleware.verificarPropriedade(models.cliente, 'id'),
    clienteController.atualizarCliente
);

router.delete('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.cliente, 'id', 'Cliente'),
    authMiddleware.verificarPropriedade(models.cliente, 'id'),
    clienteController.removerCliente
);

module.exports = router;