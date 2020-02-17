var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Medico = require('../models/medico');

var Autenticacion = require('../middlewares/autenticacion');


/* ==========================
    Obtener todos los medico
==========================*/

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
        .skip(desde)
        // .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los medico',
                    errores: err
                });
            }

            Medico.countDocuments({}, (error, total) => {
                res.status(200).json({
                    ok: true,
                    medico: medico,
                    total: total
                });
            });

        });
});

/* ==========================
    Obtener medico
==========================*/

app.get('/:id', (req, res) => {
    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error actualizando medico',
                    errores: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Este medico no existe',
                    errores: err
                });
            }

            res.status(200).json({
                ok: false,
                medico: medico
            });

        });
});

/* ==========================
    Guardar medico
==========================*/

app.post('/', Autenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario,
        hospital: body.hospital
    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico',
                errores: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medico
        });
    });
});

/* ==========================
    Actualizar los medico
==========================*/

app.put('/:id', Autenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando medico',
                errores: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Este medico no existe',
                errores: err
            });
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario;
        medico.hospital = body.hospital;


        medico.save((err, medico) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error guardando medico'
                });
            }
            res.status(201).json({
                ok: true,
                medico: medico,
                usuario: res.usuario
            });
        });

    });
});

/* ==========================
    Eliminar medico por id
==========================*/
app.delete('/:id', Autenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndDelete(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminando registro',
                errores: err
            });
        }
        if (!medico) {
            return status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errores: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medico
        });

    });
});

module.exports = app;