const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    telefono: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Person', PersonSchema);