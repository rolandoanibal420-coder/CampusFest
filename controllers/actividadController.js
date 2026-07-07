// Importamos el modelo que ya hiciste
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