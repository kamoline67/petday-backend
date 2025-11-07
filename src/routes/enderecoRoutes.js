const express = require('express');
const router = express.Router();

const { enderecoController, models } = require('../controllers/enderecoController');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.put('/:tipo_entidade/:entidade_id/',
            validarCamposObrigatorios([ 'cidade', 'rua', 'numero', 'bairro', 'estado', 'cep']), 
            enderecoController.adicionarOuAtualizarEndereco);

router.get('/:tipo_entidade/:entidade_id/', enderecoController.listarEndereco);
router.delete('/:tipo_entidade/:entidade_id/', enderecoController.removerEndereco);

module.exports = router;