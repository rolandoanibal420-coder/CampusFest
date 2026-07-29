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