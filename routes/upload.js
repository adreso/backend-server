var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

//Rutas


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    //validar tipo de coleccion
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Tipo de coleccion no valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'NO selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var extension = archivo.name.split('.')[archivo.name.split('.').length - 1];

    //Validar extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Debe seleccionar una extension valida: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ extension}`;

    //Mover archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'usuario no existe',
                    errors: { message: 'usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = '';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'medico no existe',
                    errors: { message: 'medico no existe' }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    errors: { message: 'hospital no existe' }
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;