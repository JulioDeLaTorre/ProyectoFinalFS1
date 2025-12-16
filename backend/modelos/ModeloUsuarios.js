// modelos/usuarioModelo.js
const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor teclea un nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor teclea un email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Por favor teclea una contraseña']
    },
    // Campo 'rol' para diferenciar entre 'usuario' y 'soporte'
    rol: {
        type: String,
        enum: ['usuario', 'soporte'], // Define los roles posibles
        default: 'usuario' // Rol por defecto
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);