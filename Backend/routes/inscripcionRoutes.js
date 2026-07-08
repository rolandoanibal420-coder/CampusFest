const express = require('express');
const router = express.Router();
// Ajusta la importación al nombre de las funciones en inscripcionController.js
const { crearInscripcion, obtenerInscripciones } = require('../controllers/inscripcionController');

router.post('/', crearInscripcion);
router.get('/', obtenerInscripciones);

module.exports = router;