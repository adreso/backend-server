var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/* ==========================
    Verficiar token
==========================*/
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
    });
};


/* ==========================
    Verficiar admin
==========================*/
exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no valido - No es adminstrador',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
};


/* ==========================
    Verficiar admin o mismo Usuario
==========================*/
exports.verificaADMIN_ROLE_usuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no valido - No es adminstrador ni es el mismo usuario',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
};