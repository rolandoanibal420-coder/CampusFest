const mongoose = require('mongoose');

// El Schema es el molde metálico con las reglas para el formulario de contacto
const ContactoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  correo: { 
    type: String, 
    required: [true, 'El correo es obligatorio'] 
  },
  asunto: { 
    type: String, 
    required: [true, 'El asunto es obligatorio'] 
  },
  mensaje: { 
    type: String, 
    required: [true, 'El mensaje no puede estar vacío'] 
  }
});

// Creamos el modelo y lo exportamos para usarlo luego en los endpoints
module.exports = mongoose.model('Contacto', ContactoSchema);