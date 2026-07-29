const mongoose = require('mongoose');

const schemaStand = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    responsable: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Stand = mongoose.model('Stand', schemaStand);

module.exports = Stand;