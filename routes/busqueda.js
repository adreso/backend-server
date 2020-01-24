var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuario = require('../models/usuario');

/* ==========================
    Buscar por parametro en coleccion mi soucion
==========================*/

// app.get('/coleccion/:tabla/:busqueda', (req, res) => {
//     var tabla = req.params.tabla;
//     var busqueda = req.params.busqueda;
//     var regex = new RegExp(busqueda, 'i');
//     if (tabla === 'medico' || tabla === 'hospital' || tabla === 'usuario') {
//         Promise.all([
//             (tabla === 'hospital') ? buscarHospitales(regex) : false,
//             (tabla === 'medico') ? buscarMedicos(regex) : false,
//             (tabla === 'usuario') ? buscarUsuarios(regex) : false
//         ]).then(
//             respuestas => {
//                 res.status(200).json({
//                     ok: true,
//                     hospitales: respuestas[0],
//                     medicos: respuestas[1],
//                     usuarios: respuestas[2]
//                 });
//             });
//     } else {
//         res.status(400).json({
//             ok: false,
//             mensaje: 'ruta invalida'
//         });
//     }
// });


/* ==========================
    Buscar por parametro en coleccion solucion Humbertico
==========================*/

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son solo Hopistales, medicos y usuarios',
                errores: { message: 'Tipo de tabla no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


/* ==========================
    Buscar por todo
==========================*/



app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(
        respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });
});


function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medicos.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: regex }, (err, usuarios) => {
            if (err) {
                reject('Error al cargar usuarios', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;