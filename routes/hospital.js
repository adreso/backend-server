var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Hospital = require('../models/hospital');

var Autenticacion = require('../middlewares/autenticacion');


/* ==========================
    Obtener todos los hospitales
==========================*/

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los hospitales',
                    errores: err
                });
            }
            Hospital.countDocuments({}, (err, total) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: total
                });
            });
        });
});

/* ==========================
    Guardar hospital
==========================*/

app.post('/', Autenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errores: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuario: req.usuario
        });
    });
});


// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un hospital con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

/* ==========================
    Actualizar los hospitales
==========================*/

app.put('/:id', Autenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospitales) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando hospital',
                errores: err
            });
        }
        if (!hospitales) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Este hospital no existe',
                errores: err
            });
        }
        hospitales.nombre = body.nombre;
        hospitales.img = body.img;
        hospitales.usuario = res.usuario;


        hospitales.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error guardando hospital'
                });
            }
            res.status(201).json({
                ok: true,
                hospital: hospitalActualizado,
                usuario: res.usuario
            });
        });

    });
});

/* ==========================
    Eliminar hospital por id
==========================*/
app.delete('/:id', Autenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminando registro',
                errores: err
            });
        }
        if (!hospitalBorrado) {
            return status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errores: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});

module.exports = app;