const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/authMiddleware');
const { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } = require('../controladores/controladoresTareas');

// router.get('/', (req,res) =>{
//     res.status(200).json({mensaje: 'Obtener todas las tareas RutasTareas'});
// });
router.get('/',proteger, obtenerTareas);
router.post('/',proteger, crearTarea);
router.put('/:id',proteger, actualizarTarea);
router.delete('/:id',proteger, eliminarTarea);

// router.post('/',(req,res) =>{
//     res.status(200).json({mensaje: 'Crear Tarea'})
// })

// router.put('/:id',(req,res)=>{
//     res.status(200).json({mensaje: `Tarea ${req.params.id} actualizada.`});
// });

// router.delete('/:id', (req,res) => {
//     res.status(200).json({mensaje: `Tarea ${req.params.id} eliminada`});
// });



module.exports = router;