const Contacto = require('../models/Contacto');

exports.crearContacto = async (req, res) => {
    try {
        const nuevoContacto = new Contacto(req.body);
        const guardado = await nuevoContacto.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar contacto', detalle: error.message });
    }
};

exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await Contacto.find();
        res.status(200).json(contactos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener contactos' });
    }
};