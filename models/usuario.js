'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    apellido:String,
    clave:String,
    correo:String,
    datos:
        [
            {
                comentario:
                [
                    {
                        com:String,
                        usuario:String
                    }

                ]
                   
                ,
                mensaje:String,
                video:String
            }
        ],
    edad:String,
    nombre:String,
    sexo:String,
})

module.exports = mongoose.model('usuario', UserSchema)