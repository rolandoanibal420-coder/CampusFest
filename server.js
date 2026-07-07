const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Importación de controladores (ajusta la ruta incluyendo '/controllers/')
const actividadController = require('./controllers/actividadController');
const contactoController = require('./controllers/contactoController');
const inscripcionController = require('./controllers/inscripcionController');

app.use(express.json());

// Conexión a MongoDB Local
mongoose.connect('mongodb://127.0.0.1:27017/CampusFest')
    .then(() => console.log('¡Conexión exitosa a MongoDB Local!'))
    .catch((err) => {
        console.error('ERROR AL CONECTAR:', err);
        process.exit(1);
    });

// --- RUTAS DE ACTIVIDADES ---
app.post('/api/actividades', actividadController.crearActividad);
app.get('/api/actividades', actividadController.obtenerActividades);

// --- RUTAS DE CONTACTOS ---
app.post('/api/contactos', contactoController.crearContacto);
app.get('/api/contactos', contactoController.obtenerContactos);

// --- RUTAS DE INSCRIPCIONES ---
app.post('/api/inscripciones', inscripcionController.crearInscripcion);
app.get('/api/inscripciones', inscripcionController.obtenerInscripciones);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});