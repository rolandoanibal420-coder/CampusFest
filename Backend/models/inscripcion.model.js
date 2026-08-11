const mongoose = require('mongoose');

const schemaInscripcion = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
  identificacion: { type: String, required: [true, 'La identificación es obligatoria'] },
  correo: { type: String, required: [true, 'El correo es obligatorio'] },
  telefono: { type: String, required: [true, 'El teléfono es obligatorio'] },
  carrera: { type: String, required: [true, 'La carrera o grupo es obligatoria'] },
  actividad: { type: String, required: [true, 'La actividad es obligatoria'] },
  comentarios: { type: String, default: '' },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  }
}, {
  timestamps: true   
});

const Inscripcion = mongoose.model('Inscripcion', schemaInscripcion);

module.exports = { Inscripcion };