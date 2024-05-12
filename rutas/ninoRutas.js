const express = require('express');
const router = express.Router();
const NinoModel = require('../models/Nino');
//muestra todos los datos
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

// Actualiza un niño por su ID
router.put('/editarNino/:id', async (req, res) => {
    try {
        // Busca el niño por su ID y actualiza los campos proporcionados en el cuerpo de la solicitud
        const ninoActualizado = await NinoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Verifica si se encontró y actualizó correctamente el niño
        if (!ninoActualizado) {
            return res.status(404).json({ mensaje: 'Niño no encontrado' });
        }

        // Devuelve el niño actualizado como respuesta
        res.json(ninoActualizado);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el código de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;