const express  = require('express');
const router   = express.Router();
const Usuario  = require('../models/usuario.model');

const DOMINIO_ADMIN = '@ucenfotec.ac.cr';

// Determina si un correo es institucional
function esAdmin(correo) {
    return correo.trim().toLowerCase().endsWith(DOMINIO_ADMIN);
}

/* ─────────────────────────────────────────────
   GET /usuarios
   Devuelve todos los usuarios registrados.
   Usado por el panel admin en inicio.html
───────────────────────────────────────────── */
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().sort({ createdAt: -1 });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ msj: 'Error al obtener usuarios', error: error.message });
    }
});

/* ─────────────────────────────────────────────
   GET /usuarios/:id
   Devuelve un usuario por su _id de MongoDB.
───────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ msj: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ msj: 'Error al obtener el usuario', error: error.message });
    }
});

/* ─────────────────────────────────────────────
   POST /usuarios/registro
   Crea un nuevo usuario. Asigna rol según correo.
───────────────────────────────────────────── */
router.post('/registro', async (req, res) => {
    const { nombre, identificacion, telefono, carrera, correo } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !identificacion || !telefono || !carrera || !correo) {
        return res.status(400).json({ msj: 'Todos los campos son obligatorios' });
    }

    // Validación de formato de correo
    if (!correo.includes('@') || !correo.includes('.')) {
        return res.status(400).json({ msj: 'El correo no tiene un formato válido' });
    }

    try {
        const rol = esAdmin(correo) ? 'admin' : 'visitante';

        const nuevoUsuario = new Usuario({
            nombre,
            identificacion,
            telefono,
            carrera,
            correo: correo.toLowerCase(),
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);

    } catch (error) {
        // Error 11000 = clave duplicada en MongoDB (identificacion o correo)
        if (error.code === 11000) {
            const campo = error.keyValue.correo ? 'correo' : 'identificación';
            return res.status(409).json({
                msj: `Ya existe una cuenta con ese ${campo}. Iniciá sesión.`
            });
        }
        res.status(500).json({ msj: 'Error al registrar el usuario', error: error.message });
    }
});

/* ─────────────────────────────────────────────
   POST /usuarios/login
   Verifica identificacion + correo.
   Devuelve el usuario si existe, 401 si no.
───────────────────────────────────────────── */
router.post('/login', async (req, res) => {
    const { identificacion, correo } = req.body;

    if (!identificacion || !correo) {
        return res.status(400).json({ msj: 'La cédula y el correo son obligatorios' });
    }

    try {
        const usuario = await Usuario.findOne({
            identificacion: identificacion.trim(),
            correo: correo.trim().toLowerCase()
        });

        if (!usuario) {
            return res.status(401).json({
                msj: 'No encontramos una cuenta con esa cédula y correo. ¿Ya te registraste?'
            });
        }

        // Recalcular rol en base al correo (por si cambió)
        usuario.rol = esAdmin(correo) ? 'admin' : 'visitante';
        await usuario.save();

        res.status(200).json(usuario);

    } catch (error) {
        res.status(500).json({ msj: 'Error al iniciar sesión', error: error.message });
    }
});

/* ─────────────────────────────────────────────
   PUT /usuarios/:id
   Actualiza los datos de un usuario existente.
───────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
    const { nombre, identificacion, telefono, carrera, correo } = req.body;

    if (!nombre || !identificacion || !telefono || !carrera || !correo) {
        return res.status(400).json({ msj: 'Todos los campos son obligatorios' });
    }

    try {
        const rol = esAdmin(correo) ? 'admin' : 'visitante';

        const actualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            { nombre, identificacion, telefono, carrera, correo: correo.toLowerCase(), rol },
            { new: true, runValidators: true }
        );

        if (!actualizado) return res.status(404).json({ msj: 'Usuario no encontrado' });

        res.status(200).json(actualizado);

    } catch (error) {
        if (error.code === 11000) {
            const campo = error.keyValue.correo ? 'correo' : 'identificación';
            return res.status(409).json({ msj: `Ya existe una cuenta con ese ${campo}.` });
        }
        res.status(500).json({ msj: 'Error al actualizar el usuario', error: error.message });
    }
});

/* ─────────────────────────────────────────────
   DELETE /usuarios/:id
   Elimina un usuario por su _id de MongoDB.
───────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ msj: 'Usuario no encontrado' });
        res.status(200).json({ msj: 'Usuario eliminado correctamente', usuario: eliminado });
    } catch (error) {
        res.status(500).json({ msj: 'Error al eliminar el usuario', error: error.message });
    }
});

module.exports = router;