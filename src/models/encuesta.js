const mongoose = require('mongoose');
const cliente = require('./ArchivoModel')

const EncuestaSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Archivo'
    },
    filtro: {
        type: String,
        enum: [
            "Cuelga Llamada",
            "Fuera de Servicio",
            "Incompleta - Volver a llamar",
            "Llamar en otro Horario",
            "No Contesta",
            "No Responde - No Llamar",
            "Ok (Encuesta Completa)",
            "OK Dejar respuestas encuesta anterior",
            "Otro país - Cuelga Llamada",
            "Otro país - Fuera de servicio",
            "Otro país - Llamar otro horario",
            "Otro país - No Contesta",
            "Otro país - Ok (Dejar respuestas encuesta anterior)",
            "Otro país - Ok (Encuesta Completa)",
            "Otro país - Sin contacto",
            "Otro país - Teléfono Apagado",
            "Otro país - Teléfono Equivocado",
            "Otro país - Teléfono Errado",
            "Otro país - WhatsApp (Responde Por Este Canal)",
            "Teléfono Apagado",
            "Teléfono Equivocado",
            "Teléfono Errado",
            "Teléfono otro país",
            "WhatsApp (Responde Por Este Canal)"
        ],
        required: true
    },
    procedimiento: { type: String },
    experienciaGlobal: { type: String },
    experienciaMejora: { type: String },
    recomendacion: { type: String },
    recomendacionMejora: { type: String },
    actitudRecepcion: { type: String },
    recepcionMejora: { type: String },
    profesional: { type: String },
    profesionalMejora: { type: String },
    salaEspera: { type: String },
    salaEsperaMejora: { type: String },
    atencionTelefonica: { type: String },
    comentarioAdicional: { type: String },
    observacionLlamada: { type: String },
    calificacionLlamada: { type: String },
}, {
    timestamps: true
});

EncuestaSchema.post('save', async function(doc) {
    await cliente.findByIdAndUpdate(doc.clienteId, {
        $addToSet: { encuestas: doc._id }
    });
})


module.exports = mongoose.model('Encuesta', EncuestaSchema);
