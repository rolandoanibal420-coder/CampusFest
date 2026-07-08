require('dotenv').config(); // Carga las variables desde el archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar rutas
const actividadRoutes = require('./routes/actividadRoutes');
const contactoRoutes = require('./routes/contactoRoutes'); // Verifica que el nombre del archivo sea correcto
const inscripcionRoutes = require('./routes/inscripcionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A MONGODB ---
// Usamos la variable que definimos en el archivo .env
mongoose.connect("mongodb://127.0.0.1:27017/CampusFest")
.then(() => {
    console.log("¡Conexión exitosa a la base de datos local!");
    
    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Servidor corriendo en http://localhost:" + PORT);
    });
})
.catch((error) => {
    console.error("Error conectando a MongoDB:", error);
});

// Definición de rutas base
app.use('/api/actividades', actividadRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

app.get('/', (req, res) => {
    res.send('Backend de CampusFest funcionando correctamente');
});