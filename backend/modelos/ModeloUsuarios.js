const moongoose = require('mongoose');

const esquemaUsuario = moongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor ingrese un nombre']
    },
    email:{
        type: String,
        required: [true, 'Por favor ingrese un email'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Por favor ingrese una contraseña']
    }},
    {
        timestamps: true,
    });

module.exports = moongoose.model('Usuario', esquemaUsuario);   