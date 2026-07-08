const express = require('express');
const router = express.Router();
const { crearActividad, obtenerActividades } = require('../controllers/actividadController');

router.post('/', crearActividad);
router.get('/', obtenerActividades);

module.exports = router;