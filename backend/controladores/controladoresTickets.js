// controladores/ticketControlador.js
const asyncHandler = require('express-async-handler');
const Ticket = require('../modelos/ModeloTicket');
const Usuario = require('../modelos/ModeloUsuarios');

// Función auxiliar para determinar la prioridad automática (EXTRA)
const obtenerPrioridadAutomatica = (estadoInicial) => {
    // Implementación simple de prioridad automática
    if (estadoInicial === 'nuevo') return 'baja';
    return 'media'; 
};

// @desc    Obtener tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
    let tickets;

    // Si es soporte, obtiene TODOS los tickets, si no, solo los suyos
    if (req.usuario.rol === 'soporte') {
        tickets = await Ticket.find().populate('usuario', 'nombre').populate('staff', 'nombre');
    } else {
        tickets = await Ticket.find({ usuario: req.usuario.id }).populate('usuario', 'nombre');
    }

    res.status(200).json(tickets);
});

// @desc    Obtener un ticket por ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate('usuario', 'nombre email rol')
        .populate('staff', 'nombre email rol')
        .populate('notas.usuario', 'nombre email rol'); // Popula los usuarios de las notas
    
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    // El usuario debe ser el creador O ser personal de soporte
    if (ticket.usuario._id.toString() !== req.usuario.id && req.usuario.rol !== 'soporte') {
        res.status(401);
        throw new Error('No autorizado para ver este ticket');
    }

    res.status(200).json(ticket);
});

// @desc    Crear un nuevo ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    if (req.usuario.rol !== 'usuario') {
        res.status(403);
        throw new Error('Solo los usuarios con rol "usuario" pueden crear tickets');
    }
    
    const { titulo, descripcion, prioridad } = req.body;

    if (!titulo || !descripcion) {
        res.status(400);
        throw new Error('Por favor incluya un título y descripción');
    }

    // Aplica la función de Prioridad Automática
    const prioridadFinal = prioridad || obtenerPrioridadAutomatica('nuevo'); 
    
    const ticket = await Ticket.create({
        usuario: req.usuario.id,
        titulo,
        descripcion,
        prioridad: prioridadFinal,
        estado: 'nuevo'
    });

    res.status(201).json(ticket);
});

// @desc    Actualizar un ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    const dataToUpdate = {};
    
    // El usuario debe ser el creador O ser personal de soporte
    if (ticket.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'soporte') {
        res.status(401);
        throw new Error('No autorizado para actualizar este ticket');
    }

    // Lógica de actualización basada en el rol
    if (req.usuario.rol === 'soporte') {
        // Staff puede actualizar todos los campos clave
        dataToUpdate.estado = req.body.estado || ticket.estado;
        dataToUpdate.prioridad = req.body.prioridad || ticket.prioridad;
        dataToUpdate.staff = req.body.staff || ticket.staff;
        dataToUpdate.descripcion = req.body.descripcion || ticket.descripcion;

    } else {
        // Usuario solo puede actualizar la descripción, y solo si no está cerrado
        if (ticket.estado === 'cerrado') {
            res.status(400);
            throw new Error('No se puede actualizar un ticket cerrado');
        }
        dataToUpdate.descripcion = req.body.descripcion || ticket.descripcion;
        // Si el usuario edita, el estado pasa a 'abierto' si era 'nuevo'
        if (ticket.estado === 'nuevo') {
             dataToUpdate.estado = 'abierto';
        }
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id, 
        dataToUpdate, 
        { new: true }
    );
    
    res.status(200).json(updatedTicket);
});

// @desc    Eliminar un ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Solo rol 'soporte', protegido con soloSoporte en la ruta)
const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    await Ticket.deleteOne({ _id: req.params.id });

    res.status(200).json({ mensaje: 'Ticket eliminado correctamente' });
});


// --- Funciones para Notas/Comentarios (sub-recurso) ---

// @desc    Obtener todas las notas de un ticket
// @route   GET /api/tickets/:id/notas
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate('notas.usuario', 'nombre email rol'); 
    
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    // El usuario debe ser el creador O ser personal de soporte
    if (ticket.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'soporte') {
        res.status(401);
        throw new Error('No autorizado para ver las notas de este ticket');
    }
    
    let notas;
    if (req.usuario.rol === 'soporte') {
        // El staff ve todas las notas (internas y externas)
        notas = ticket.notas;
    } else {
        // Un usuario normal solo ve las notas que NO son internas del staff
        notas = ticket.notas.filter(nota => !nota.esStaff);
    }

    res.status(200).json(notas);
});


// @desc    Agregar una nota/comentario a un ticket
// @route   POST /api/tickets/:id/notas
// @access  Private
const addNote = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    // El usuario debe ser el creador O ser personal de soporte
    if (ticket.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'soporte') {
        res.status(401);
        throw new Error('No autorizado para añadir notas a este ticket');
    }
    
    if (!req.body.texto) {
        res.status(400);
        throw new Error('Por favor incluya el texto de la nota');
    }
    
    const newNote = {
        usuario: req.usuario.id,
        texto: req.body.texto,
        esStaff: req.usuario.rol === 'soporte' // Comentario interno si es soporte
    };

    // Agregar la nota e intentar guardar
    ticket.notas.push(newNote);
    await ticket.save();

    // Devuelve la nota recién añadida
    res.status(201).json(ticket.notas[ticket.notas.length - 1]);
});


module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getNotes,
    addNote
};