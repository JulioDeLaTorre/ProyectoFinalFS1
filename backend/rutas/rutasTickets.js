// rutas/rutasTickets.js
const express = require('express');
const router = express.Router();
const { 
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getNotes,
    addNote
} = require('../controladores/controladoresTickets');
const { proteger, soloSoporte } = require('../middleware/authMiddleware'); 

// Rutas principales de Tickets
// GET/POST /api/tickets
router.route('/')
    .get(proteger, getTickets)  
    .post(proteger, createTicket); 

// GET/PUT/DELETE /api/tickets/:id
router.route('/:id')
    .get(proteger, getTicket)   
    .put(proteger, updateTicket) 
    .delete(proteger, soloSoporte, deleteTicket); // La eliminación solo es permitida al staff

// Rutas anidadas para Notas/Comentarios
// GET/POST /api/tickets/:id/notas
router.route('/:id/notas')
    .get(proteger, getNotes)
    .post(proteger, addNote);

module.exports = router;