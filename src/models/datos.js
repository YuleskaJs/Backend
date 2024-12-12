const mongoose = require('mongoose')

const datosSchema = new mongoose.Schema({
    nombre: String,
    telAjustado: String,
    fechaServicio: Date,
    profesional: String,
    servicio: String
  });
  
  module.exports = mongoose.model('Datos', datosSchema);
