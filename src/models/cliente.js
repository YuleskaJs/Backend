const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
    
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  fecha_servicio: { type: Date, required: true },
  profesional: { type: String, required: true },
  servicio: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
});

const Cliente = mongoose.model("Cliente", ClienteSchema, "clientes");

module.exports = Cliente;
