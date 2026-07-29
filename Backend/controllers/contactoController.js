// controllers/contactoController.js
const Contacto = require('../models/Contacto');

exports.crearContacto = (req, res) => {
    const nuevoContacto = new Contacto(req.body);
    
    nuevoContacto.save()
        .then(guardado => res.status(201).json(guardado))
        .catch(error => res.status(400).json({ 
            mensaje: 'Error al registrar contacto', 
            detalle: error.message 
        }));
};

exports.obtenerContactos = (req, res) => {
    Contacto.find()
        .then(contactos => res.status(200).json(contactos))
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al obtener contactos',
            detalle: error.message
        }));
};