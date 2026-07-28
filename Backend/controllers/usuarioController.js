const Usuario = require('../models/usuario.model');

const DOMINIO_ADMIN = '@ucenfotec.ac.cr';

// Determina si un correo es institucional
function esAdmin(correo) {
    return correo.trim().toLowerCase().endsWith(DOMINIO_ADMIN);
}

exports.obtenerUsuarios = (req, res) => {
    Usuario.find().sort({ createdAt: -1 })
        .then(usuarios => res.status(200).json(usuarios))
        .catch(error => res.status(500).json({ msj: 'Error al obtener usuarios', error: error.message }));
};

exports.obtenerUsuarioPorId = (req, res) => {
    Usuario.findById(req.params.id)
        .then(usuario => {
            if (!usuario) return res.status(404).json({ msj: 'Usuario no encontrado' });
            res.status(200).json(usuario);
        })
        .catch(error => res.status(500).json({ msj: 'Error al obtener el usuario', error: error.message }));
};

exports.registrarUsuario = (req, res) => {
    const { nombre, identificacion, telefono, carrera, correo } = req.body;

    if (!nombre || !identificacion || !telefono || !carrera || !correo) {
        return res.status(400).json({ msj: 'Todos los campos son obligatorios' });
    }
    if (!correo.includes('@') || !correo.includes('.')) {
        return res.status(400).json({ msj: 'El correo no tiene un formato válido' });
    }

    const rol = esAdmin(correo) ? 'admin' : 'visitante';
    const nuevoUsuario = new Usuario({
        nombre,
        identificacion,
        telefono,
        carrera,
        correo: correo.toLowerCase(),
        rol
    });

    nuevoUsuario.save()
        .then(guardado => res.status(201).json(guardado))
        .catch(error => {
            if (error.code === 11000) {
                const campo = error.keyValue.correo ? 'correo' : 'identificación';
                return res.status(409).json({ msj: `Ya existe una cuenta con ese ${campo}. Iniciá sesión.` });
            }
            res.status(500).json({ msj: 'Error al registrar el usuario', error: error.message });
        });
};

exports.loginUsuario = (req, res) => {
    const { identificacion, correo } = req.body;

    if (!identificacion || !correo) {
        return res.status(400).json({ msj: 'La cédula y el correo son obligatorios' });
    }

    Usuario.findOne({
        identificacion: identificacion.trim(),
        correo: correo.trim().toLowerCase()
    })
    .then(usuario => {
        if (!usuario) {
            return res.status(401).json({ msj: 'No encontramos una cuenta con esa cédula y correo. ¿Ya te registraste?' });
        }
        
        // Recalcular rol en base al correo
        usuario.rol = esAdmin(correo) ? 'admin' : 'visitante';
        return usuario.save().then(userActualizado => res.status(200).json(userActualizado));
    })
    .catch(error => res.status(500).json({ msj: 'Error al iniciar sesión', error: error.message }));
};

exports.actualizarUsuario = (req, res) => {
    const { nombre, identificacion, telefono, carrera, correo } = req.body;

    if (!nombre || !identificacion || !telefono || !carrera || !correo) {
        return res.status(400).json({ msj: 'Todos los campos son obligatorios' });
    }

    const rol = esAdmin(correo) ? 'admin' : 'visitante';

    Usuario.findByIdAndUpdate(
        req.params.id,
        { nombre, identificacion, telefono, carrera, correo: correo.toLowerCase(), rol },
        { new: true, runValidators: true }
    )
    .then(actualizado => {
        if (!actualizado) return res.status(404).json({ msj: 'Usuario no encontrado' });
        res.status(200).json(actualizado);
    })
    .catch(error => {
        if (error.code === 11000) {
            const campo = error.keyValue.correo ? 'correo' : 'identificación';
            return res.status(409).json({ msj: `Ya existe una cuenta con ese ${campo}.` });
        }
        res.status(500).json({ msj: 'Error al actualizar el usuario', error: error.message });
    });
};

exports.eliminarUsuario = (req, res) => {
    Usuario.findByIdAndDelete(req.params.id)
        .then(eliminado => {
            if (!eliminado) return res.status(404).json({ msj: 'Usuario no encontrado' });
            res.status(200).json({ msj: 'Usuario eliminado correctamente', usuario: eliminado });
        })
        .catch(error => res.status(500).json({ msj: 'Error al eliminar el usuario', error: error.message }));
};