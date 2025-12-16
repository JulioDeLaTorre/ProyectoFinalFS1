// controladores/usuarioControlador.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Usuario = require('../modelos/ModeloUsuarios');

// Función para generar JWT (necesaria en login y registro)
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETO, {
        expiresIn: '30d'
    });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/usuarios
// @access  Public
const registrarUsuario = asyncHandler(async (req, res) => {
    const { nombre, email, password, rol } = req.body; // Recibe rol opcional

    if (!nombre || !email || !password) {
        res.status(400);
        throw new Error('Por favor incluye todos los campos');
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        rol: rol || 'usuario' // Asigna 'usuario' por defecto si no se especifica
    });

    if (usuario) {
        res.status(201).json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol, // Devuelve el rol
            token: generarToken(usuario._id)
        });
    } else {
        res.status(400);
        throw new Error('Datos de usuario inválidos');
    }
});

// @desc    Autenticar un usuario
// @route   POST /api/usuarios/login
// @access  Public
const loginUsuario = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (usuario && (await bcrypt.compare(password, usuario.password))) {
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol, // Devuelve el rol
            token: generarToken(usuario._id)
        });
    } else {
        res.status(400);
        throw new Error('Credenciales inválidas');
    }
});

// @desc    Obtener datos del usuario actual
// @route   GET /api/usuarios/me
// @access  Private
const getDatosUsuario = asyncHandler(async (req, res) => {
    res.status(200).json(req.usuario);
});

module.exports = {
    registrarUsuario,
    loginUsuario,
    getDatosUsuario
};