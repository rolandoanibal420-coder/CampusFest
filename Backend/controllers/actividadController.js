const Actividad = require('../models/Actividad');

// Función para crear una actividad
exports.crearActividad = async (req, res) => {
    try {
        const nuevaActividad = new Actividad(req.body);
        const guardada = await nuevaActividad.save();
        // Código 201 porque se creó con éxito
        res.status(201).json(guardada); 
    } catch (error) {
        // Código 400 si faltan datos obligatorios
        res.status(400).json({ mensaje: 'Error: revisa que todos los campos sean correctos', detalle: error.message });
    }
};

// Función para obtener todas las actividades
exports.obtenerActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find();
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener actividades' });
    }
};

// Función para actualizar una actividad
exports.actualizarActividad = async (req, res) => {
    try {
        const actividadActualizada = await Actividad.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!actividadActualizada) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada' });
        }
        
        res.status(200).json(actividadActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la actividad', detalle: error.message });
    }
};

// Función para eliminar una actividad
exports.eliminarActividad = async (req, res) => {
    try {
        const actividadEliminada = await Actividad.findByIdAndDelete(req.params.id);
        
        if (!actividadEliminada) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada' });
        }
        
        res.status(200).json({ mensaje: 'Actividad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la actividad', detalle: error.message });
    }
};