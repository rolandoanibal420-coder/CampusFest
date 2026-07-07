const mongoose = require('mongoose');

// El Schema con las reglas para las actividades del CampusFest
const ActividadSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre de la actividad es obligatorio'] 
  },
  categoria: { 
    type: String, 
    required: [true, 'La categoría es obligatoria']
  },
  fecha: { 
    type: String, 
    required: [true, 'La fecha es obligatoria'] 
  },
  hora: { 
    type: String, 
    required: [true, 'La hora es obligatoria'] 
  },
  lugar: { 
    type: String, 
    required: [true, 'El lugar es obligatorio'] 
  },
  cupoMax: { 
    type: Number, 
    required: [true, 'El cupo máximo es obligatorio'] 
  },
  destacada: { 
    type: Boolean, 
    default: false 
  }
});

// Creamos y exportamos el modelo de Actividad
module.exports = mongoose.model('Actividad', ActividadSchema);