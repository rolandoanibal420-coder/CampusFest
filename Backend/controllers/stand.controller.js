const Stand = require('../models/stand.model');

// Obtener todos los stands
exports.obtenerStands = (req, res) => {
    Stand.find().sort({ createdAt: -1 })
        .then(stands => res.status(200).json(stands))
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al obtener los stands', 
            detalle: error.message 
        }));
};

// Obtener un stand por su ID
exports.obtenerStandPorId = (req, res) => {
    Stand.findById(req.params.id)
        .then(stand => {
            if (!stand) return res.status(404).json({ mensaje: 'Stand no encontrado' });
            res.status(200).json(stand);
        })
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al buscar el stand', 
            detalle: error.message 
        }));
};

// Crear un nuevo stand (para uso del Admin)
exports.crearStand = (req, res) => {
    const nuevoStand = new Stand(req.body);

    nuevoStand.save()
        .then(guardado => res.status(201).json(guardado))
        .catch(error => res.status(400).json({ 
            mensaje: 'Error al crear el stand', 
            detalle: error.message 
        }));
};

// Actualizar un stand
exports.actualizarStand = (req, res) => {
    Stand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(actualizado => {
            if (!actualizado) return res.status(404).json({ mensaje: 'Stand no encontrado para actualizar' });
            res.status(200).json(actualizado);
        })
        .catch(error => res.status(400).json({ 
            mensaje: 'Error al actualizar el stand', 
            detalle: error.message 
        }));
};

// Eliminar un stand
exports.eliminarStand = (req, res) => {
    Stand.findByIdAndDelete(req.params.id)
        .then(eliminado => {
            if (!eliminado) return res.status(404).json({ mensaje: 'Stand no encontrado para eliminar' });
            res.status(200).json({ mensaje: 'Stand eliminado correctamente', eliminado });
        })
        .catch(error => res.status(500).json({ 
            mensaje: 'Error al eliminar el stand', 
            detalle: error.message 
        }));
};