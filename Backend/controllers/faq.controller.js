const Faq = require('../models/faq.model');

// Obtener todas las preguntas frecuentes
exports.obtenerFaqs = (req, res) => {
    Faq.find().sort({ createdAt: -1 })
        .then(faqs => res.status(200).json(faqs))
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al obtener las FAQs', 
            detalle: error.message 
        }));
};

// Crear una nueva pregunta frecuente (para uso del Admin)
exports.crearFaq = (req, res) => {
    const nuevaFaq = new Faq(req.body);

    nuevaFaq.save()
        .then(guardada => res.status(201).json(guardada))
        .catch(error => res.status(400).json({ 
            mensaje: 'Error al crear la FAQ', 
            detalle: error.message 
        }));
};

// Eliminar una FAQ por su ID
exports.eliminarFaq = (req, res) => {
    Faq.findByIdAndDelete(req.params.id)
        .then(eliminada => {
            if (!eliminada) return res.status(404).json({ mensaje: 'FAQ no encontrada' });
            res.status(200).json({ mensaje: 'FAQ eliminada correctamente', eliminada });
        })
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al eliminar la FAQ', 
            detalle: error.message 
        }));
};