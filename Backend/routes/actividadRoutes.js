const express = require('express');
const router = express.Router();
// Importamos las funciones necesarias
const actividadController = require('../controllers/actividadController'); 

router.post('/', actividadController.crearActividad);
router.get('/', actividadController.obtenerActividades);
router.put('/:id', actividadController.actualizarActividad);      
router.delete('/:id', actividadController.eliminarActividad);   

module.exports = router;