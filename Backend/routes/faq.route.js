const express = require('express');
const router = express.Router();
const { obtenerFaqs, crearFaq, eliminarFaq } = require('../controllers/faq.controller');

router.get('/', obtenerFaqs);
router.post('/', crearFaq);
router.delete('/:id', eliminarFaq);

module.exports = router;