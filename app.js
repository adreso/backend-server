// Requieres
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//Inicializar variables
var app = express();


// Body parser
// create application/json parser // create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var loginRoutes = require('./routes/login');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');


//conexion a la base de datos
// mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://adreso:010190@cluster0-di16z.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// (err, res) => {
// mongoose.connection.openUri('mongodb+srv://adreso:010190@cluster0-di16z.mongodb.net/test?retryWrites=true&w=majority', (err, res) => {
//     if (err) throw err;

//     console.log('Base de datos en puerto 27017: \x1b[32m%s\x1b[0m', 'online');

// });

//Rutas
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});