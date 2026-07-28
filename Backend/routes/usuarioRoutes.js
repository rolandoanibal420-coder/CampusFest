const express = require('express');
const router = express.Router();

// Importamos todas las funciones desde el controlador correcto
const { 
    obtenerUsuarios, 
    obtenerUsuarioPorId, 
    registrarUsuario, 
    loginUsuario, 
    actualizarUsuario, 
    eliminarUsuario 
} = require('../controllers/usuarioController');

// Definición de endpoints
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;