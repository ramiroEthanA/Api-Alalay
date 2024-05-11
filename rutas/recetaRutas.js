const express = require('express');
const router = express.Router();
const NinoModel = require('../models/Nino');

router.get('/traerNinos', async (req, res) => {
    try {
        const ninos = await NinoModel.find();
        res.json(ninos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;