const express = require('express');
const router = express.Router();
const NinoModel = require('../models/Nino');
const moment = require('moment');
//M1 muestra todos los datos
router.get('/traerNinos', async (req, res) => {
    try {
        const ninos = await NinoModel.find();
        res.json(ninos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//M2 Crea usario nuevo
router.post('/crearNino', async (req, res) => {
    try {
        // Crear un nuevo niño
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
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

// M3 Actualiza un niño por su ID
router.put('/editarNino/:id', async (req, res) => {
    try {
        // Busca el niño por su ID y actualiza los campos proporcionados en el cuerpo
        const ninoActualizado = await NinoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Verifica si se encontro y actualizo correctamente el niño
        if (!ninoActualizado) {
            return res.status(404).json({ mensaje: 'Niño no encontrado' });
        }

        // Devuelve el niño actualizado como respuesta
        res.json(ninoActualizado);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});
//M4 borrar por ID

router.delete('/eliminarNino/:id', async (req, res) => {
    try {
        // Busca el niño por su ID y elimínalo de la base de datos
        const ninoEliminado = await NinoModel.findByIdAndDelete(req.params.id);

        // Verifica si se encontro y elimino correctamente el niño
        if (!ninoEliminado) {
            return res.status(404).json({ mensaje: 'Niño no encontrado' });
        }

        // Devuelve el niño eliminado como respuesta
        res.json(ninoEliminado);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

// M5 Obtener un niño por su ID
router.get('/obtenerNino/:id', async (req, res) => {
    try {
        // Busca el niño por su ID en la base de datos
        const nino = await NinoModel.findById(req.params.id);

        // Verifica si se encontro el niño
        if (!nino) {
            return res.status(404).json({ mensaje: 'Niño no encontrado' });
        }

        // Devuelve el niño encontrado como respuesta
        res.json(nino);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

// M6 Buscar niños por su apellido
router.get('/buscarPorApellido', async (req, res) => {
    try {
        const apellido = req.query.apellido;

        // Busca los niños por su apellido en la base de datos
        const ninos = await NinoModel.find({ Apellido: apellido });

        // Verifica si se encontraron niños con el apellido especificado
        if (ninos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron niños con ese apellido' });
        }

        // Devuelve los niños encontrados como respuesta
        res.json(ninos);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

// M7 Contar todos los registros de niños
router.get('/contarNinos', async (req, res) => {
    try {
        // Contar todos los registros de niños en la base de datos
        const totalNinos = await NinoModel.countDocuments();

        // Devolver el total de registros como respuesta
        res.json({ totalNinos });
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});


// M8 Obtener todos los niños ordenados por apellido ascendente
router.get('/OrdenApellido', async (req, res) => {
    try {
        // Buscar todos los niños y ordenarlos por apellido ascendente
        const ninosOrdenados = await NinoModel.find().sort({ Apellido: 1 });

        // Verificar si se encontraron niños
        if (ninosOrdenados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron niños' });
        }

        // Devolver los niños encontrados como respuesta
        res.json(ninosOrdenados);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el código de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});


// M9  Busqueda por patron en la direccion de los niños
router.get('/buscarPorDireccion', async (req, res) => {
    try {
        // Obtener el patron proporcionado por el usuario desde Postman
        const patronDireccion = req.query.direccion;

        // Realizar la busqueda de niños cuya direccin coincida con el patron proporcionado
        const ninos = await NinoModel.find({
            direccion: { $regex: new RegExp(`.*${patronDireccion}.*`, 'i') }
        });

        // Devolver los niños encontrados como respuesta
        res.json(ninos);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
}); 


// M10 Obtener todos los niños y ordenarlos por apellido y por nombre
router.get('/ordenarNinos', async (req, res) => {
    try {
        // Obtener todos los niños de la base de datos
        let ninos = await NinoModel.find();

        // Ordenar los niños por apellido y luego por nombre en orden ascendente
        ninos = ninos.sort((a, b) => {
            // Verificar si ambos niños tienen definidos los campos apellido y nombre
            if (!a.apellido || !b.apellido || !a.nombre || !b.nombre) {
                return 0; // Si uno de los campos es undefined, no se puede comparar
            }

            // Primero, ordenar por apellido
            const comparacionApellido = a.apellido.localeCompare(b.apellido);
            if (comparacionApellido !== 0) {
                return comparacionApellido;
            }
            
            // Si los apellidos son iguales, ordenar por nombre
            return a.nombre.localeCompare(b.nombre);
        });

        // Devolver los niños ordenados como respuesta
        res.json(ninos);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el código de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});


//M11 Obtener todos los niños y calcular su edad a partir de la fecha de nacimiento
router.get('/calcularEdadNinos', async (req, res) => {
    try {
        // Obtener todos los niños de la base de datos
        const ninos = await NinoModel.find();

        // Calcular la edad de cada niño, se usa la funcion moment que ya se instalo anteriormente
        const ninosConEdad = ninos.map(nino => {
            const fechaNacimiento = moment(nino.fecha_nacimiento);
            const edad = moment().diff(fechaNacimiento, 'years');
            return { ...nino.toObject(), edad };
        });

        // Devolver los niños con sus edades calculadas como respuesta
        res.json(ninosConEdad);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
    }
});

// M12 Agrupacion por etapa y conteo de niños en cada etapa
router.get('/contarNinosPorEtapa', async (req, res) => {
    try {
        // Realizar la agregacion para contar niños por etapa
        const resultadoAgregacion = await NinoModel.aggregate([
            { $group: { _id: "$cod_etapa", totalNinos: { $sum: 1 } } }
        ]);

        // Devolver el resultado de la agregacion como respuesta
        res.json(resultadoAgregacion);
    } catch (error) {
        // Si hay un error, devolver un mensaje de error con el codigo de estado 500
        res.status(500).json({ mensaje: error.message });
        
    }
});

module.exports = router;