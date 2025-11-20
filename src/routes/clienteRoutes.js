/**
 * @swagger
 * /api/clientes:
 *  post:
 *    summary: Criar um novo cliente.
 *    tags: [Clientes]
 *    requestBody:
 *      required: true
 *      content:
 *      application/json:
 *      schema:
 *       $ref: '#/components/schemas/Cliente'
 *    responses:
 *      201:
 *          description: Cliente criado com sucesso.
 *          content:
 *            application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  message: 
 *                      type: string
 *                  cliente:
 *                      $ref: '#/componentes/schemas/Cliente'
 *       400:
 *           description: Requisição inválida.
 *         
 */

/**
 * @swagger
 * /api/clientes:
 *  get:
 *    summary: Lista todos os cliente.
 *    tags: [Clientes]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *          description: Lista de clientes.
 *          content:
 *            application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  message: 
 *                      type: string
 *                  quantidade:
 *                      type: integer
 *                  clientes:
 *                      type: array
 *                      items:
 *                          $ref: '#/componentes/schemas/Cliente'
 *       400:
 *           description: Requisição inválida.
 *         
 */

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