/*
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
*/

const mongoose = require('mongoose');

const schemaStand = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del stand es obligatorio'],
    trim: true
  },
  responsable: {
    type: String,
    required: [true, 'El responsable es obligatorio'],
    trim: true
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es obligatoria'],
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['cultural', 'deportiva', 'tecnologica', 'artistica', 'gastronomica', 'recreativa'],
      message: 'Categoría no válida'
    }
  },
  descripcion: {
    type: String,
    default: ''
  },
  // activo  → visible para visitantes
  // cancelado → solo visible para admin (soft delete conceptual,
  //             en este proyecto el DELETE es permanente pero
  //             se mantiene el campo por consistencia con el resto)
  estado: {
  type: String,
  enum: ['activo', 'cancelado', 'pendiente'],
  default: 'pendiente' // O 'activo' si lo crea el admin directamente
}
}, {
  timestamps: true
});

const Stand = mongoose.model('Stand', schemaStand);
module.exports = Stand;