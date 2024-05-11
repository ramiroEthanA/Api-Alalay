const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const ninoRutas = require('./rutas/ninoRutas');

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
        console.log('Conexión exitosa');
        app.listen(PORT, () => { console.log("Servidor express corriendo en el puerto: " + PORT) })
    }
).catch(error => console.log('Error de conexión', error));

app.use('/ninos', ninoRutas);