
const express = require('express');

const {errorHandler} = require('./middleware/errorMiddleware');

const dotenv = require('dotenv').config();
const puerto = process.env.PORT || 5000;
const dbConexion =  require('./conexion/dbConexion');
dbConexion();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //no lo queremos extendido

//app.get('/api/tareas', (req, res) => {
//  res.status(200).json({ mensaje: 'Obtener todas las tareas' });
//});

app.use('/api/tickets', require('./rutas/rutasTickets'));
app.use('/api/usuarios', require('./rutas/rutasUsuarios'));

app.use(errorHandler);

app.get('/', (req, res) => {
  res.redirect('/api/tareas');
});

app.listen(puerto, () => {
 // console.log(`Servidor escuchando en http://localhost:${puerto}`);
  console.log(`Servidor escuchando en 22130804EHR.jcarlos19.com:${puerto}`);
});
