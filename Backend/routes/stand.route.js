/*
const express = require('express');
const router = express.Router();
const { 
    obtenerStands, 
    obtenerStandPorId, 
    crearStand, 
    actualizarStand, 
    eliminarStand 
} = require('../controllers/stand.controller');

router.get('/', obtenerStands);
router.get('/:id', obtenerStandPorId);
router.post('/', crearStand);
router.put('/:id', actualizarStand);
router.delete('/:id', eliminarStand);

module.exports = router;
*/
const express = require('express');
const router  = express.Router();
const Stand   = require('../models/stand.model');

/* ─────────────────────────────────────────────
   GET /stands
   Sin parámetros  → solo activos (vista visitante)
   ?todas=true     → todos incluidos cancelados (admin)
   ?categoria=     → filtra por categoría
   ?q=             → busca por nombre o responsable
───────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const filtro = {};

    if (!req.query.todas) {
      filtro.estado = 'activo';
    }

    if (req.query.categoria) filtro.categoria = req.query.categoria;

    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      filtro.$or  = [{ nombre: regex }, { responsable: regex }];
    }

    const stands = await Stand.find(filtro).sort({ createdAt: -1 });
    res.status(200).json(stands);

  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener stands', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   GET /stands/estadisticas
   Totales por estado y por categoría (panel admin)
───────────────────────────────────────────── */
router.get('/estadisticas', async (req, res) => {
  try {
    const todos = await Stand.find();

    const totales = {
      total:     todos.length,
      activos:   todos.filter(s => s.estado === 'activo').length,
      cancelados:todos.filter(s => s.estado === 'cancelado').length
    };

    const porCategoria = ['cultural','deportiva','tecnologica',
                          'artistica','gastronomica','recreativa']
      .map(cat => ({
        categoria: cat,
        cantidad:  todos.filter(s => s.categoria === cat).length
      }));

    res.status(200).json({ totales, porCategoria });

  } catch (error) {
    res.status(500).json({ msj: 'Error al calcular estadísticas', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   GET /stands/:id
───────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const stand = await Stand.findById(req.params.id);
    if (!stand) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json(stand);
  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener el stand', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   POST /stands
   Crea un nuevo stand (admin)
───────────────────────────────────────────── */
router.post('/', async (req, res) => {
  const { nombre, responsable, ubicacion, categoria, descripcion } = req.body;

  if (!nombre || !responsable || !ubicacion || !categoria) {
    return res.status(400).json({
      msj: 'Nombre, responsable, ubicación y categoría son obligatorios'
    });
  }

  try {
    const nuevo = new Stand({
      nombre:      nombre.trim(),
      responsable: responsable.trim(),
      ubicacion:   ubicacion.trim(),
      categoria,
      descripcion: descripcion || '',
      estado:      'activo'
    });

    await nuevo.save();
    res.status(201).json(nuevo);

  } catch (error) {
    res.status(500).json({ msj: 'Error al crear el stand', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   PUT /stands/:id
   Actualiza un stand (admin)
───────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  const { nombre, responsable, ubicacion, categoria, descripcion, estado } = req.body;

  if (!nombre || !responsable || !ubicacion || !categoria) {
    return res.status(400).json({ msj: 'Faltan campos obligatorios' });
  }

  const estadosValidos = ['activo', 'cancelado'];
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ msj: 'Estado no válido' });
  }

  try {
    const actualizado = await Stand.findByIdAndUpdate(
      req.params.id,
      {
        nombre:      nombre.trim(),
        responsable: responsable.trim(),
        ubicacion:   ubicacion.trim(),
        categoria,
        descripcion: descripcion || '',
        estado:      estado || 'activo'
      },
      { new: true, runValidators: true }
    );

    if (!actualizado) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json(actualizado);

  } catch (error) {
    res.status(500).json({ msj: 'Error al actualizar el stand', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   DELETE /stands/:id
   Elimina permanentemente un stand (admin)
───────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Stand.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ msj: 'Stand no encontrado' });
    res.status(200).json({ msj: 'Stand eliminado correctamente', stand: eliminado });
  } catch (error) {
    res.status(500).json({ msj: 'Error al eliminar el stand', error: error.message });
  }
});

module.exports = router;