const mongoose = require('mongoose');
 
const schemaUsuario = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    identificacion: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    carrera: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    // El rol se deriva del correo en la ruta, pero se persiste
    // para no recalcularlo en cada login
    rol: {
        type: String,
        enum: ['admin', 'visitante'],
        default: 'visitante'
    }
}, {
    // Agrega createdAt y updatedAt automáticamente
    timestamps: true
});
 
const Usuario = mongoose.model('Usuario', schemaUsuario);
 
module.exports = Usuario;
 