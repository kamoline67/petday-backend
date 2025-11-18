const express = require('express');
const router = express.Router();

const { authController } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validarCamposObrigatorios = require('../middleware/validarCamposObrigatorios');

router.post('/login',
    validarCamposObrigatorios(['email', 'senha' ]), authController.login
);

router.get('/perfil',
    authMiddleware.verificarToken,
    authController.perfil
);

router.put('/perfil',
    authMiddleware.verificarToken,
    authController.atualizarPerfil
);

module.exports = router;