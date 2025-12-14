const asyncHandler = require('express-async-handler');
const Tareas = require('../modelos/ModeloTareas');
const Usuario = require('../modelos/ModeloUsuarios');
const {json} = require('express');

const obtenerTareas = asyncHandler(async(req, res)=>{
    //res.status(200).json({mensaje: 'Obtener todas las tareas'});
    const tareas = await Tareas.find({usuario:req.usuario.id});
    res.status(200).json(tareas);
});

const crearTarea = asyncHandler(async (req,res) =>{
    if(!req.body.texto || !req.body.texto){
        res.status(400);
        throw new Error({mensaje: 'Por favor introduzca texto una tarea'});
    }
    //console.log(req.body);
    //res.status(200).json({mensaje: 'Crear Tarea'});
    const tarea = await Tareas.create({texto: req.body.texto, usuario: req.usuario.id});
    res.status(200).json(tarea);
});

const actualizarTarea = asyncHandler(async(req,res) => {
    //res.status(200).json({mensaje: `Tarea ${req.params.id} actualizada`});
    const tarea = await Tareas.findById(req.params.id);
    if(!tarea){
        res.status(400);
        throw new Error('Tarea no encontrada');
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if(!usuario){
        res.status(401);
        throw new Error('No se encontro el usuario');
    }

    if(tarea.usuario.toString() !== usuario.id){
        res.status(401);
        throw new Error('Usuario no autorizado para actualizar esta tarea');
    }

    const tareaActualizada = await Tareas.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.status(200).json(tareaActualizada);
});

const eliminarTarea = asyncHandler(async(req,res) => {
    //res.status(200).json({mensaje: `Tarea ${req.params.id} eliminada`});
    const tarea = await Tareas.findById(req.params.id);
    if(!tarea){
        res.status(400);
        throw new Error('Tarea no encontrada');
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if(!usuario){
        res.status(401);
        throw new Error('No se encontro el usuario');
    }

    if(tarea.usuario.toString() !== usuario.id){
        res.status(401);
        throw new Error('Usuario no autorizado para eliminar esta tarea');
    }

    await Tareas.findByIdAndDelete(req.params.id);
    res.status(200).json({id: req.params.id});
});

module.exports = {obtenerTareas, crearTarea, actualizarTarea, elimzinarTarea};