const express = require('express');
const router = express.Router();

const { petController, models } = require('../controllers/petController');
const validarExistencia = require('../middleware/validarExistencia');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/',
    validarCamposObrigatorios([ 'cliente_id', 'nome', 'especie', 'idade', 'sexo', 'porte_id' ]),
    validarExistencia(models.cliente, 'cliente_id', 'Cliente', 'body'),
    petController.criarPet
);
router.get('/', petController.listarPets);

router.get('/:id', validarExistencia(
                                    models.pet, 'id', 'Pet', 'params',
                                    [
                                        {model: models.cliente, attributes: ['nome', 'telefone', 'email' ] },
                                        {model: models.porte, attributes: ['descricao']},
                                    ],
                                ),
                                petController.buscarPetPorId);

router.put('/:id', validarExistencia(
                                    models.pet, 'id', 'Pet', 'params',
                                    [ 
                                        {model: models.cliente, attributes: ['nome', 'telefone', 'email' ] },
                                        {model: models.porte, attributes: ['descricao']},
                                    ]
                                ),
                                petController.atualizarPet);
                                
router.delete('/:id', validarExistencia(models.pet, 'id', 'Pet'), petController.removerPet);

module.exports = router;