const express = require('express');
const router = express.Router();
const NinoModel = require('../models/Nino');

// Endpoint 1: Visualiza todo
router.get('/traerNinos', async (req, res) => {
    try {
        const ninos = await NinoModel.find();
        res.json(ninos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//Crea
router.post('/crearNino', async (req, res) => {
    try {
        // Crear un nuevo niño utilizando los datos proporcionados en el cuerpo de la solicitud
        const nuevoNino = new NinoModel({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            sexo: req.body.sexo,
            fecha_nacimiento: req.body.fecha_nacimiento,
            celular: req.body.celular,
            direccion: req.body.direccion,
            email: req.body.email,
            cod_etapa: req.body.cod_etapa,
            cod_grado: req.body.cod_grado
        });

        // Guardar el niño en la base de datos
        const ninoGuardado = await nuevoNino.save();

        // Devolver el niño guardado como respuesta
        res.status(201).json(ninoGuardado);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el código de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});


module.exports = router;