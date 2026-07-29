const mongoose = require('mongoose');

const schemaFaq = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
        trim: true
    },
    respuesta: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Faq = mongoose.model('Faq', schemaFaq);

module.exports = Faq;