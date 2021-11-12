const userModel = require('../models/user.model')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.GetAllUsers = async (req, res) => {

    try {
        const users = await userModel.  
        res.status(200).json({ users })

    } catch (error) {
        console.log('Error GetAllUsers', error)
    }
}

exports.GetOneUser = async (req, res) => {

    try {

        const id = req.params.id
        const user = await userModel.findOne({ _id: id })
        res.status(200).json({ user })

    } catch (error) {
        console.log('Error GetOneUser', error)
    }
}

exports.RegisterUser = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {

        const { nombre, apellido, email, contrasenia } = req.body
        let emailExists = await userModel.findOne({ email });

        if (emailExists) {
            console.log(emailExists)
            return res.status(400).json({ msg: 'Email Existente' })
        }

        const user = {
            nombre,
            apellido,
            email,
            tokens: []
        }

        const salt = await bcryptjs.genSalt(10);
        user.contrasenia = await bcryptjs.hash(contrasenia, salt);

        const newUSer = new userModel(user);
        await newUSer.save()

        res.status(201).json({ msg: 'Usuario Registrado' })

    } catch (error) {
        console.log('Error RegisterUser', error);
    }
}

exports.LoginUser = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const { email, contrasenia } = req.body

        const userLogin = await userModel.findOne({ email });
        if (!userLogin) {
            return res.status(400).json({ msg: 'Usuario y/o Contraseña Incorrectos' })
        }

        const passCheck = await bcryptjs.compare(contrasenia, userLogin.contrasenia);
        if (!passCheck) {
            return res.status(400).json({ msg: 'Usuario y/o Contraseña Incorrectos' })
        }

        const jwt_payload = {
            user: {
                id: userLogin.id,
                email: userLogin.email,
                role: userLogin.role
            }
        }

        const token = jwt.sign(jwt_payload, process.env.JWT_SECRET, { expiresIn: process.env.TIME_EXP })
        userLogin.token = [token]
        await userModel.updateOne({ email: userLogin.email }, userLogin)
        res.status(200).json({ msg: 'Logueado Correctamente', token, id: userLogin._id, role: userLogin.role })

    } catch (error) {
        console.log('Error LoginUser', error);
    }
}

exports.LogoutUser = async (req, res) => {

    try {

        await userModel.updateOne({ _id: res.locals.user.id }, { $set: { token: [] } })
        res.status(200).json({ msg: 'Usuario Deslogueado' })
    } catch (error) {
        console.log('Error LogoutUser', error);
    }
}

exports.ModifyUser = async (req, res) => {

    try {

        const modUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ modUser })

    } catch (error) {
        console.log('Error ModifyUser', error)
    }
}

exports.DeleteOneUser = async (req, res) => {

    try {

        const deleteUser = await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: 'Usuario Eliminado' })

    } catch (error) {
        console.log('Error DeleteOneUser', error)
    }
}
