// modelos/ticketModelo.js
const mongoose = require('mongoose');

// Sub-esquema para los comentarios/notas (Historial y Comentarios internos)
const notaSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    texto: {
        type: String,
        required: [true, 'Por favor teclea el texto de la nota']
    },
    // Indica si la nota es un comentario interno del staff
    esStaff: { 
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const ticketSchema = mongoose.Schema({
    // Usuario que creó el ticket (el 'usuario' con rol 'usuario')
    usuario: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    // Personal de soporte asignado al ticket (opcional al inicio)
    staff: { 
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        ref: 'Usuario'
    },
    titulo: {
        type: String,
        required: [true, 'Por favor teclea un título para el ticket']
    },
    descripcion: {
        type: String,
        required: [true, 'Por favor teclea una descripción del problema']
    },
    // Estados del ticket
    estado: {
        type: String,
        enum: ['nuevo', 'abierto', 'en revisión', 'cerrado'],
        default: 'nuevo'
    },
    // Prioridad del ticket (extras)
    prioridad: {
        type: String,
        enum: ['baja', 'media', 'alta', 'urgente'],
        default: 'baja'
    },
    // Array que contendrá los comentarios/notas
    notas: [notaSchema] 

},
{
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);