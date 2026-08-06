/*
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
*/

const Stand = require('../models/stand.model');

// Obtener stands (filtrados por estado, categoría o búsqueda)
const obtenerStands = async (req, res) => {
  try {
    const filtro = {};

    if (!req.query.todas) {
      filtro.estado = 'activo';
    }

    if (req.query.categoria) filtro.categoria = req.query.categoria;

    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      filtro.$or = [{ nombre: regex }, { responsable: regex }];
    }

    const stands = await Stand.find(filtro).sort({ createdAt: -1 });
    res.status(200).json(stands);

  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener stands', error: error.message });
  }
};

// Obtener estadísticas para el panel admin
const obtenerEstadisticas = async (req, res) => {
  try {
    const todos = await Stand.find();

    const totales = {
      total: todos.length,
      activos: todos.filter(s => s.estado === 'activo').length,
      cancelados: todos.filter(s => s.estado === 'cancelado').length
    };

    const porCategoria = ['cultural', 'deportiva', 'tecnologica', 'artistica', 'gastronomica', 'recreativa']
      .map(cat => ({
        categoria: cat,
        cantidad: todos.filter(s => s.categoria === cat).length
      }));

    res.status(200).json({ totales, porCategoria });

  } catch (error) {
    res.status(500).json({ msj: 'Error al calcular estadísticas', error: error.message });
  }
};

// Obtener un stand por ID
const obtenerStandPorId = async (req, res) => {
  try {
    const stand = await Stand.findById(req.params.id);
    if (!stand) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json(stand);
  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener el stand', error: error.message });
  }
};

// Crear un nuevo stand
const crearStand = async (req, res) => {
  // 1. Incluye 'estado' en la desestructuración de req.body (opcional)
  const { nombre, responsable, ubicacion, categoria, descripcion, estado } = req.body;

  if (!nombre || !responsable || !ubicacion || !categoria) {
    return res.status(400).json({
      msj: 'Nombre, responsable, ubicación y categoría son obligatorios'
    });
  }

  try {
    const nuevo = new Stand({
      nombre: nombre.trim(),
      responsable: responsable.trim(),
      ubicacion: ubicacion.trim(),
      categoria,
      descripcion: descripcion || '',
      // 2. Permite que tome el estado enviado, o asígnale 'pendiente' por defecto
      estado: estado || 'pendiente' 
    });

    await nuevo.save();
    res.status(201).json(nuevo);

  } catch (error) {
    res.status(500).json({ msj: 'Error al crear el stand', error: error.message });
  }
};

// Actualizar un stand
// Actualizar un stand
const actualizarStand = async (req, res) => {
  const { nombre, responsable, ubicacion, categoria, descripcion, estado } = req.body;

  if (!nombre || !responsable || !ubicacion || !categoria) {
    return res.status(400).json({ msj: 'Faltan campos obligatorios' });
  }

  const estadosValidos = ['activo', 'cancelado', 'pendiente'];
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ msj: 'Estado no válido' });
  }

  try {
    const actualizado = await Stand.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre.trim(),
        responsable: responsable.trim(),
        ubicacion: ubicacion.trim(),
        categoria,
        descripcion: descripcion || '',
        estado: estado || 'activo'
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!actualizado) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json(actualizado);

  } catch (error) {
    res.status(500).json({ msj: 'Error al actualizar el stand', error: error.message });
  }
};

// Eliminar un stand
const eliminarStand = async (req, res) => {
  try {
    const eliminado = await Stand.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json({ msj: 'Stand eliminado correctamente', stand: eliminado });
  } catch (error) {
    res.status(500).json({ msj: 'Error al eliminar el stand', error: error.message });
  }
};

module.exports = {
  obtenerStands,
  obtenerEstadisticas,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand
};