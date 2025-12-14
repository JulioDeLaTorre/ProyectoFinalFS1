// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Usuario = require('../modelos/ModeloUsuarios');

// Middleware para verificar el token JWT y autenticar al usuario
const proteger = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // 1. Obtener el token (quitar 'Bearer')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token con el secreto
            const decoded = jwt.verify(token, process.env.JTW_SECRETO);

            // 3. Obtener el usuario del token y adjuntarlo a la solicitud (excluyendo la contraseña)
            req.usuario = await Usuario.findById(decoded.id).select('-password');
            req.usuario.rol = req.usuario.rol || 'usuario'; // Asegurar que el rol esté cargado
            
            next(); // Continuar
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('No autorizado, token fallido');
        }
    }

    if(!token){
        res.status(401);
        throw new Error('No autorizado, no se encontró token');
    }
});

// Middleware para restringir el acceso solo al rol 'soporte'
const soloSoporte = (req, res, next) => {
    // Asume que req.usuario está cargado por el middleware 'proteger'
    if (req.usuario && req.usuario.rol === 'soporte') {
        next(); // Es soporte, permite continuar
    } else {
        res.status(403);
        throw new Error('Acceso denegado, se requiere rol de Soporte');
    }
};

module.exports = {
    proteger,
    soloSoporte
};