const mongoose = require('mongoose');

// Catálogo de actividades con sus cupos máximos
// Se usa para validar en el backend que no se supere el límite
const ACTIVIDADES_VALIDAS = [
  { nombre: 'Hackathon de IA',              cupoMax: 30  },
  { nombre: 'Festival Gastronómico',        cupoMax: 200 },
  { nombre: 'Exposición de Arte Digital',   cupoMax: 80  },
  { nombre: 'Torneo de Fútbol 5',           cupoMax: 60  },
  { nombre: 'Noche de Teatro',              cupoMax: 120 },
  { nombre: 'Escape Room Tecnológico',      cupoMax: 20  },
  { nombre: 'Taller de Robótica',           cupoMax: 25  },
  { nombre: 'Jam de Música en Vivo',        cupoMax: 150 },
  { nombre: 'Maratón de Danza',             cupoMax: 50  }
];

const schemaInscripcion = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  identificacion: {
    type: String,
    required: [true, 'La identificación es obligatoria']
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio']
  },
  carrera: {
    type: String,
    required: [true, 'La carrera o grupo es obligatoria']
  },
  actividad: {
    type: String,
    required: [true, 'La actividad es obligatoria'],
    enum: {
      values: ACTIVIDADES_VALIDAS.map(a => a.nombre),
      message: 'La actividad seleccionada no es válida'
    }
  },
  comentarios: {
    type: String,
    default: ''
  },
  // Estado: pendiente al registrarse, el admin lo cambia a confirmada
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  }
}, {
  timestamps: true   // agrega createdAt y updatedAt automáticamente
});

// Exportar también el catálogo para usarlo en las rutas
const Inscripcion = mongoose.model('Inscripcion', schemaInscripcion);

module.exports = { Inscripcion, ACTIVIDADES_VALIDAS };