const express = require('express');
const router = express.Router();
// Ajusta la importación al nombre de las funciones en contactoController.js
const { crearContacto, obtenerContactos } = require('../controllers/contactoController');

router.post('/', crearContacto);
router.get('/', obtenerContactos);

module.exports = router;