const express = require('express');
const router = express.Router();

const { petController, models } = require('../controllers/petController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',
    validarCamposObrigatorios([ 'cliente_id', 'nome', 'especie', 'idade', 'sexo', 'porte_id' ]),
    authMiddleware.verificarPropriedade(models.cliente, 'cliente_id', 'body'),
    validarExistencia(models.porte, 'porte_id', 'Porte', 'body'),
    petController.criarPet
);

router.get('/',
    authMiddleware.verificarToken,
    petController.listarPets
);

router.get('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.pet, 'id', 'Pet'),
    authMiddleware.verificarPropriedade(models.pet, 'id'),
     petController.buscarPetPorId);

router.put('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.pet, 'id', 'Pet'),
    authMiddleware.verificarPropriedade(models.pet, 'id'),
    petController.atualizarPet
);
                                
router.delete('/:id',
    authMiddleware.verificarToken,
    validarExistencia(models.pet, 'id', 'Pet'),
    authMiddleware.verificarPropriedade(models.pet, 'id'),
    petController.removerPet
);

module.exports = router;