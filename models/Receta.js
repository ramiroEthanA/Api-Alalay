
const mongoose = require('mongoose');

const ninoSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    sexo: String,
    fecha_nacimiento: String,
    celular: String,
    direccion: String,
    email: String,
    cod_etapa: String,
    cod_grado: String
});

const NinoModel = mongoose.model('Nino', ninoSchema, 'nino');
module.exports = NinoModel;