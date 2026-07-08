// Importamos el modelo de Inscripción
const Inscripcion = require('../models/Inscripcion');

// Función para crear una inscripción
exports.crearInscripcion = async (req, res) => {
    try {
        const nuevaInscripcion = new Inscripcion(req.body);
        const guardada = await nuevaInscripcion.save();
        res.status(201).json(guardada); // Código 201: Creado con éxito
    } catch (error) {
        res.status(400).json({ 
            mensaje: 'Error al registrar la inscripción. Asegúrate de que los IDs sean válidos.', 
            detalle: error.message 
        });
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