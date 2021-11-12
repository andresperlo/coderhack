const { Schema, model } = require('mongoose')

const UserSchema = new Schema({

    nombre: {
        type: String,
        trim: true,
        required: true
    },
    apellido: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    contrasenia:{
        type: String,
        trim: true,
        required: true
    },
    role:{
        type: String,
        default: 'user',
        trim: true
    },

    token: [String]
})

const UserModel = model('user', UserSchema)
module.exports = UserModel;
