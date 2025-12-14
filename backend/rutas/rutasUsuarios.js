// rutas/rutasUsuarios.js
const express = require('express');
const router = express.Router();
const { 
    registrarUsuario,
    loginUsuario,
    getDatosUsuario
} = require('../controlador/controladoresUsuarios');
const { proteger } = require('../middleware/authMiddleware');

router.post('/', registrarUsuario);
router.post('/login', loginUsuario);
// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/me', proteger, getDatosUsuario);

module.exports = router;