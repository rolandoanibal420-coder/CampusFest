const mongoose = require('mongoose');

// El Schema con las reglas para registrar un estudiante a un evento
const InscripcionSchema = new mongoose.Schema({
  nombreCompleto: { 
    type: String, 
    required: [true, 'El nombre completo es obligatorio'] 
  },
  identificacion: { 
    type: String, 
    required: [true, 'La identificación es obligatoria'] 
  },
  correo: { 
    type: String, 
    required: [true, 'El correo electrónico es obligatorio'] 
  },
  telefono: { 
    type: String, 
    required: [true, 'El número de teléfono es obligatorio'] 
  },
  carrera: { 
    type: String, 
    required: [true, 'La carrera es obligatoria'] 
  }
});

// Creamos y exportamos el modelo de Inscripción
module.exports = mongoose.model('Inscripcion', InscripcionSchema);