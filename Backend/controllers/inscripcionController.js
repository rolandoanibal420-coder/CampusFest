// Importamos el modelo de Inscripción
const Inscripcion = require('../models/Inscripcion');

// Función para crear una inscripción
exports.crearInscripcion = async (req, res) => {
    // Imprime exactamente qué texto llegó desde el navegador
    console.log("Actividad recibida desde el frontend:", JSON.stringify(req.body.actividad));

    try {
        const nuevaInscripcion = new Inscripcion(req.body);
        const guardada = await nuevaInscripcion.save();
        res.status(201).json(guardada);
    } catch (error) {
        console.error("Error detallado de Mongoose:", error.message);
        res.status(400).json({ msj: error.message });
    }
};
// Función para obtener todas las inscripciones
exports.obtenerInscripciones = async (req, res) => {
    try {
        // Usamos .populate si quieres que en lugar de solo el ID, se vea la info completa
        const inscripciones = await Inscripcion.find().populate('usuario').populate('actividad');
        res.status(200).json(inscripciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener inscripciones', detalle: error.message });
    }
};