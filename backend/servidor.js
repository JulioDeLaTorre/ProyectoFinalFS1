// servidor.js
const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const dbConexion = require('./conexion/dbConexion');
const puerto = process.env.PUERTO || 5000;
const app = express();

dbConexion();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/tickets',require('./rutas/rutasTickets')); 
app.use('/api/usuarios',require('./rutas/rutasUsuarios'));

app.get('/',(req,res)=>{
    res.redirect('/api/tickets'); 
});

// --- Manejador de errores (al final) ---
app.use(errorHandler);

// --- Servidor ---
app.listen(puerto, () => {console.log(`Servidor escuchando en http://teamnotfound.jcarlos19.com:${puerto}`);});