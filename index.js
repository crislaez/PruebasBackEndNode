'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

const Usuario = require('./models/usuario');

//para imagenes---------------------------------------------
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './img'});

//----------------------------------------------------------
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');  //el * se cambiara y se pondra la url permitida
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

mongoose.connect('mongodb://localhost:27017/viewwin', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if(err) return console.log(`error al conectarse a la base de datos: ${err}`);
    console.log('Conexion establecida');

    app.listen(port, () => {
        console.log(`Api Reast corriendo en http://localhost:${port}`);
    })
})

//****************************************************************************** */

 //todos los usuarios
app.get('/api/usuarios', (req, res) => {
    Usuario.find({}, (err, usuario) => {
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!usuario) return res.status(404).send({message: `No hay productos`});

         res.status(200).send({message:usuario}) 
    })
})

// buscar usuario por id
app.get('/api/aUser/:idUser', (req, res) => {

})

//insertar un usuario
app.post('/api/insertarUsuarios', (req, res) => {
    let usuario = new Usuario();
    usuario.apellido = req.body.apellido
    usuario.clave = req.body.clave
    usuario.correo = req.body.correo
    usuario.datos = req.body.datos
    usuario.edad = req.body.edad
    usuario.nombre = req.body.nombre
    usuario.sexo = req.body.sexo

    usuario.save((err, usuarioStored) => {
        if(err) return res.status(500).send({message: `Error al insertar el usuario: ${err}`});

        res.status(200).send({usuario: usuarioStored});
    })
})

//subir videos por usuario-----
app.put('/api/subirVideo/:id',multipartMiddleware, (req, res) => {
    let usuarioId = req.params.id
    let d = 
        {
            video:req.files.foto.path,
            mensaje:req.body.mensaje
        }

    Usuario.findByIdAndUpdate(usuarioId, { $push: { 'datos':d} },(err, usuarioStored) => {
            if(err) return res.status(500).send({message: `Error al insertar el usuario: ${err}`});
    
            res.status(200).send({usuario: usuarioStored});
        })
})

//subir videos por usuario-----
app.put('/api/subirComentario/:id', (req, res) => {
    let usuarioId = req.params.id
    let d = 
        {
            com:req.body.com,
            usuario:req.body.usuario
        }
            //{ $push: { 'datos':{$search:{'comentario':d}}} }
    Usuario.findByIdAndUpdate(usuarioId, {$push: { 'comentario':d} },(err, usuarioStored) => {
            if(err) return res.status(500).send({message: `Error al insertar el usuario: ${err}`});
    
            res.status(200).send({usuarioStored: usuarioStored});
        })
})

//borrar un usuario por ide
app.delete('/api/aUser/:idUser', (req, res) => {

})