// =============================================
//  CAMPUSFEST 2026 — index.js
//  Servidor principal Express + MongoDB Atlas
// =============================================

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Sirve los archivos del frontend (HTML, CSS, JS)
// La carpeta "public" debe estar al mismo nivel que index.js
app.use(express.static(path.join(__dirname, 'public')));

// ── Conexión a MongoDB Atlas ─────────────────
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Atlas conectado'))
    .catch(error => console.log('Error al conectarse con MongoDB:', error));

// ── Rutas API ────────────────────────────────
const usuarioRoute     = require('./routes/usuario.route');
const inscripcionRoute = require('./routes/inscripcion.route');

app.use('/usuarios',     usuarioRoute);
app.use('/inscripciones', inscripcionRoute);

// ── Ruta raíz ────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// ── Iniciar servidor ─────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});