require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


// --- Importación de Rutas ---
// Verifica que los nombres coincidan exactamente con tus archivos en la carpeta /routes
const actividadRoutes = require('./routes/actividadRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const inscripcionRoutes = require('./routes/inscripcion.route');
const usuarioRoutes = require('./routes/usuarioRoutes');
const faqRoutes = require('./routes/faq.route');
const standRoutes = require('./routes/stand.route');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve los archivos estáticos del frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// --- Conexión a MongoDB Atlas ---
// Esta línea previene errores de DNS en algunas redes al conectar con Atlas
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

console.log("Intentando conectar a MongoDB...");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("¡Conexión exitosa a la base de datos en la nube!");
        
        // Iniciar el servidor solo cuando la base de datos esté lista
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error crítico conectando a MongoDB:", error);
    });

// --- Definición de Endpoints ---
app.use('/api/actividades', actividadRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/stands', standRoutes);

// --- Ruta Raíz ---
// Redirige al inicio del frontend cuando entran a la URL base
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});