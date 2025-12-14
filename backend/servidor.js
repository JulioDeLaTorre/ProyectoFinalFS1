const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const dbConexion = require('./conexion/dbConexion');
const puerto = process.env.PUERTO || 5000;
const app = express();

dbConexion();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// --- Rutas ---
app.use('/api/tareas',require('./rutas/rutasTareas'));
app.use('/api/usuarios',require('./rutas/rutasUsuarios'));

//app.get('/api/tareas', (req, res)=>{
//    res.status(200).json({mensaje:'Obtener todas las tareas'});
//});

app.get('/',(req,res)=>{
    res.redirect('/api/tareas');
});

// --- Manejador de errores (al final) ---
app.use(errorHandler);

// --- Servidor ---
app.listen(puerto, () => {console.log(`Servidor escuchando en http://teamnotfound.jcarlos19.com:${puerto}`);});


