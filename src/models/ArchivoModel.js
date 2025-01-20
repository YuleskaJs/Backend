const mongoose = require('mongoose');
const dateConverter = require('xlsx-populate/lib/dateConverter');

const archivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipodoc: { type: String, required: true },
  documento: { type: String, required: true },
  telefono: { type: String, required: true },
  telAjustado: { type: String },
  fechaServicio: { type: Date, required: true },
  profesional: { type: String, required: true },
  servicio: { type: String, required: true },
  filtro: { type: String, default: '' },
  encuestas: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Encuesta'
  }]
}, { timestamps: true });

const Archivo = mongoose.model('Archivo', archivoSchema);   

module.exports = Archivo;
