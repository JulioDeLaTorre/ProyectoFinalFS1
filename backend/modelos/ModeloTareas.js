const mongoose = require('mongoose');

const esquemaTarea = mongoose.Schema(
    {
        texto:{type:String, required:[true,'Por favor agregue un valor al texto']},
        usuario:{type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tarea', esquemaTarea);