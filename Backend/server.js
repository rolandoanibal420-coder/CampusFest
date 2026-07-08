const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar las rutas desde la carpeta 'routes'
const actividadRoutes = require('./routes/actividadRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite recibir JSON

// --- CONFIGURACIÓN DE CONEXIÓN A MONGODB ATLAS ---
const uri = "mongodb+srv://raguilarn:Sheyla2025@cluster0.jcgyccv.mongodb.net/CampusFest?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
.then(() => {
    console.log("¡Conexión exitosa a MongoDB Atlas!");
    
    // Iniciar servidor solo después de conectar a la BD
    app.listen(3000, () => {
        console.log("Servidor corriendo en http://localhost:3000");
    });
})
.catch((error) => {
    console.error("Error conectando a MongoDB:", error);
});

// Definición de rutas base (usando los archivos de la carpeta 'routes')
app.use('/api/actividades', actividadRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Backend de CampusFest funcionando correctamente');
});