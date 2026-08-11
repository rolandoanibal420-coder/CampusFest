const Actividad = require('../models/Actividad');
const { Inscripcion } = require('../models/inscripcion.model'); 

// Función para crear una actividad
exports.crearActividad = async (req, res) => {
    try {
        const nuevaActividad = new Actividad(req.body);
        const guardada = await nuevaActividad.save();
        res.status(201).json(guardada); 
    } catch (error) {
        res.status(400).json({ mensaje: 'Error: revisa que todos los campos sean correctos', detalle: error.message });
    }
};

// Función para obtener todas las actividades con cupos calculados dinámicamente
exports.obtenerActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find();
        const inscripcionesConfirmadas = await Inscripcion.find({ estado: 'confirmada' });

        const actividadesConCupos = actividades.map(act => {
            const inscritosCount = inscripcionesConfirmadas.filter(i => i.actividad === act.nombre).length;
            const disponibles = Math.max(0, act.cupoMax - inscritosCount);

            return {
                ...act.toObject(),
                inscritos: inscritosCount,       // Cantidad de gente que ya se inscribió y fue confirmada
                disponibles: disponibles,      // Espacios libres que quedan
                cupoActual: inscritosCount     // Por si tu frontend usa cupoActual como los ocupados
            };
        });

        res.status(200).json(actividadesConCupos);
    } catch (error) {
        console.error("Error al obtener actividades con cupos:", error);
        res.status(500).json({ mensaje: 'Error al obtener actividades', detalle: error.message });
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