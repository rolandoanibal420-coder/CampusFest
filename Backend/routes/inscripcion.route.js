const express = require('express');
const router = express.Router();
const { Inscripcion } = require('../models/inscripcion.model'); 
const Actividad = require('../models/Actividad');

/* ─────────────────────────────────────────────
   GET /inscripciones
   Devuelve todas las inscripciones.
   Soporta filtros por query string:
     ?actividad=Hackathon de IA
     ?estado=pendiente
     ?q=carlos           (busca en nombre, correo, identificacion)
───────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const filtro = {};

    if (req.query.actividad) filtro.actividad = req.query.actividad;
    if (req.query.estado)    filtro.estado    = req.query.estado;
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      filtro.$or  = [
        { nombre: regex },
        { correo: regex },
        { identificacion: regex }
      ];
    }

    const inscripciones = await Inscripcion.find(filtro);
    res.status(200).json(inscripciones);

  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener inscripciones', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   GET /inscripciones/estadisticas
   Devuelve datos calculados para los 3 gráficos:
   - por actividad (con cupos disponibles)
   - por estado (pendiente / confirmada)
   - por semana (últimas 8 semanas)
───────────────────────────────────────────── */
router.get('/estadisticas', async (req, res) => {
  try {
    const todas = await Inscripcion.find();
    const listaActividades = await Actividad.find(); 

    // ── 1. Por actividad ──────────────────────
    const porActividad = listaActividades.map(a => {
      // Contamos únicamente las inscripciones que ya fueron confirmadas para restar el cupo real
      const inscritos = todas.filter(i => i.actividad === a.nombre && i.estado === 'confirmada').length;
      return {
        actividad:   a.nombre,
        inscritos,
        cupoMax:     a.cupoMax,
        disponibles: Math.max(0, a.cupoMax - inscritos)
      };
    });

    // ── 2. Totales por estado ─────────────────
    const totales = {
      total:       todas.length,
      pendientes: todas.filter(i => i.estado === 'pendiente').length,
      confirmadas:todas.filter(i => i.estado === 'confirmada').length,
      canceladas: todas.filter(i => i.estado === 'cancelada').length
    };

    // ── 3. Por semana (últimas 8 semanas) ─────
    const semanas = {};
    todas.forEach(i => {
      const fecha  = new Date(i.createdAt);
      const dia    = fecha.getDay();                    
      const diff   = (dia === 0 ? -6 : 1) - dia;            
      const lunes  = new Date(fecha);
      lunes.setDate(fecha.getDate() + diff);
      lunes.setHours(0, 0, 0, 0);
      const key = lunes.toISOString().split('T')[0];         
      semanas[key] = (semanas[key] || 0) + 1;
    });

    const porSemana = Object.entries(semanas)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([semana, cantidad]) => ({ semana, cantidad }));

    res.status(200).json({ porActividad, totales, porSemana });

  } catch (error) {
    res.status(500).json({ msj: 'Error al calcular estadísticas', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   GET /inscripciones/:id
   Devuelve una inscripción por su _id.
───────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const ins = await Inscripcion.findById(req.params.id);
    if (!ins) return res.status(404).json({ msj: 'Inscripción no encontrada' });
    res.status(200).json(ins);
  } catch (error) {
    res.status(500).json({ msj: 'Error al obtener la inscripción', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   POST /inscripciones
   Crea una nueva inscripción.
   Estado inicial: 'pendiente'
───────────────────────────────────────────── */
router.post('/', async (req, res) => {
  const { nombre, identificacion, correo, telefono, carrera, actividad, comentarios } = req.body;

  if (!nombre || !identificacion || !correo || !telefono || !carrera || !actividad) {
    return res.status(400).json({ msj: 'Todos los campos obligatorios deben completarse' });
  }

  try {
    const actividadLimpia = actividad.trim();

    const actInfo = await Actividad.findOne({
      nombre: { $regex: new RegExp(`^${actividadLimpia}$`, 'i') }
    });

    if (!actInfo) {
      return res.status(400).json({ msj: 'La actividad seleccionada no es válida' });
    }

    // Contamos solo las confirmadas para evaluar si se llenó el cupo máximo oficial
    const inscritos  = await Inscripcion.countDocuments({ actividad: actInfo.nombre, estado: 'confirmada' });
    const estaLlena  = inscritos >= actInfo.cupoMax;

    const nueva = new Inscripcion({
      nombre,
      identificacion,
      correo: correo.toLowerCase(),
      telefono,
      carrera,
      actividad: actInfo.nombre, 
      comentarios: comentarios || '',
      estado: 'pendiente'   
    });

    await nueva.save();

    res.status(201).json({
      inscripcion: nueva,
      listaEspera: estaLlena,
      msj: estaLlena
        ? 'Actividad llena. Quedaste en lista de espera.'
        : 'Inscripción registrada correctamente.'
    });

  } catch (error) {
    console.error("ERROR REAL EN EL SERVIDOR:", error);
    res.status(500).json({ msj: 'Error al registrar la inscripción', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   PUT /inscripciones/:id
   Actualiza una inscripción (admin).
───────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  const { nombre, identificacion, correo, telefono, carrera, actividad, comentarios, estado } = req.body;

  if (!nombre || !identificacion || !correo || !telefono || !carrera || !actividad || !estado) {
    return res.status(400).json({ msj: 'Todos los campos obligatorios deben completarse' });
  }

  const estadosValidos = ['pendiente', 'confirmada', 'cancelada'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ msj: 'Estado no válido. Usá: pendiente, confirmada o cancelada' });
  }

  try {
    const actualizada = await Inscripcion.findByIdAndUpdate(
      req.params.id,
      { nombre, identificacion, correo: correo.toLowerCase(), telefono, carrera, actividad, comentarios, estado },
      { new: true, runValidators: true }
    );

    if (!actualizada) return res.status(404).json({ msj: 'Inscripción no encontrada' });
    res.status(200).json(actualizada);

  } catch (error) {
    res.status(500).json({ msj: 'Error al actualizar la inscripción', error: error.message });
  }
});

/* ─────────────────────────────────────────────
   DELETE /inscripciones/:id
   Elimina una inscripción por su _id.
───────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const eliminada = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ msj: 'Inscripción no encontrada' });
    res.status(200).json({ msj: 'Inscripción eliminada correctamente', inscripcion: eliminada });
  } catch (error) {
    res.status(500).json({ msj: 'Error al eliminar la inscripción', error: error.message });
  }
});

module.exports = router;